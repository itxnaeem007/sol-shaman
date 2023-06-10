import "./HomeHero.css";
import gif from "../../assets/SolShaman.gif";
import blured from "../../assets/blured.png";
// import ellipse from '../../assets/Ellipse.png'
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
} from "reactstrap";
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "../../candy-machine";
import styled from "styled-components";
import Countdown from "react-countdown";
import { CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const HomeHero = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [number, setNumber] = useState(0);
  // const [wallet, setWallet] = useState(null)
  const dropdownClick = (n: any) => {
    setNumber(n);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleModal = () => {
    if (number) setShowModal(!showModal);
  };
  const toggleErrorModal = () => {
    setShowErrorModal(!showErrorModal);
  };

  // const connect = async () => {
  //   if (!wallet)
  //     try {
  //       let isConnected = false
  //       if (window.solana) {
  //         console.log("Phantom connected")
  //         isConnected = true
  //         await window.solana.connect()
  //       }

  //       else {
  //         console.log("Phantom not installed")
  //         isConnected = false
  //       }
  //       if (isConnected) {
  //         const account = window.solana.publicKey.toBase58()
  //         // setWallet(account)
  //       }
  //       else {
  //         console.log("Whoops...", "Phantom is not installed")
  //         toggleErrorModal()
  //       }
  //     } catch (error) {
  //       console.log("error while connecting Phantom", error)
  //       toggleErrorModal()
  //     }
  // }

  return (
    <div className="d-flex flex-column position-relative bg-image">
      <img
        src={blured}
        alt="img"
        className="blured position-absolute w-100 h-100 top-0"
      />

      <div className=" shadow-l border-gold radius-36 m-auto bg-black width-50">
        <img
          src={gif}
          alt="gif"
          className="border-gold radius-36 m-auto bg-black w-100 height-30"
        />

      </div>
      {wallet &&
      <div className="color-text shadow-l border-gold radius-36 d-flex justify-content-between px-4 py-2 m-auto bg-black width-50">
          <div className="flex">
            <div>Total Available: {itemsAvailable}</div>
            <div>Remaining: {itemsRemaining}</div>
          </div>
          <div className="flex">
            <div>Redeemed: {itemsRedeemed}</div>
            <div>Balance: {(balance || 0).toLocaleString()} SOL</div>
          </div>
        </div>}
      <p className="text-gold mx-auto mb-0">
        How many Mint Pass do you want to buy?
      </p>
      <div className="d-flex flex-column align-items-center  py-lg-2 py-3 mt-2">
        <Dropdown isOpen={showDropdown} toggle={toggleDropdown}>
          <DropdownToggle
            caret
            className="btn btn-outline-warning bg-transparent rounded-13 text-20 text-start p-lg-2 w-200"
          >
            {/* <div className='me-5 w-200 d-inline text-left'> */}
            {number ? number : "Select Mint Pass"}
            {/* </div> */}
          </DropdownToggle>
          <DropdownMenu className="w-100" dark>
            <DropdownItem onClick={() => dropdownClick(1)}>1</DropdownItem>
            <DropdownItem onClick={() => dropdownClick(2)}>2</DropdownItem>
            <DropdownItem onClick={() => dropdownClick(3)}>3</DropdownItem>
            <DropdownItem onClick={() => dropdownClick(4)}>4</DropdownItem>
            <DropdownItem onClick={() => dropdownClick(5)}>5</DropdownItem>
            <DropdownItem onClick={() => dropdownClick(6)}>6</DropdownItem>
            <DropdownItem onClick={() => dropdownClick(7)}>7</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="mt-5 pt-4 d-flex connect-box">
        {wallet &&
          <Button
            disabled={isSoldOut || isMinting || !isActive}
            onClick={onMint}
            className="btn-warning rounded-13 text-34 fw-bold p-2 me-3"
            // onClick={toggleModal}
          >
            {isSoldOut ? (
              "SOLD OUT"
            ) : isActive ? (
              isMinting ? (
                <CircularProgress />
              ) : (
                "MINT"
              )
            ) : (
              <Countdown
                date={startDate}
                onMount={({ completed }) => completed && setIsActive(true)}
                onComplete={() => setIsActive(true)}
                renderer={renderCounter}
              />
            )}
          </Button>}
          <div>
            <Modal isOpen={showModal} toggle={toggleModal} centered size="lg">
              <ModalBody className="text-34 bg-black text-white border-gold rounded p-5">
                Are you sure you want to buy {number} Mint PASS?
                <div className="m-auto w-fitContent mt-lg-5 mt-3">
                  <Button className="btn-warning rounded-13 text-24 fw-bold px-lg-3 py-lg-2 py-0 px-3 me-3">
                    Yes
                  </Button>
                  <Button
                    className="btn-outline-warning bg-transparent rounded-13 text-24 fw-bold px-lg-3 py-lg-2 py-0 px-3"
                    onClick={toggleModal}
                  >
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
          {/* <Button className='btn-outline-warning bg-transparent rounded-13 text-34 fw-bold p-2'
            onClick={connect}
          >
            {wallet ? wallet.substr(0, 8) +
              "..." +
              wallet.substr(wallet.length - 8) :
              "Connect Wallet"
            }
          </Button> */}
          {!wallet ? (
            <ConnectButton className="btn-outline-warning bg-transparent rounded-13 text-34 fw-bold p-2">
              Connect Wallet
            </ConnectButton>
          ) : (
            <Button className="btn-outline-warning bg-transparent rounded-13 text-24 fw-bold p-2">
              {shortenAddress(wallet.publicKey.toBase58() || "")}
            </Button>
          )}
          <div>
            <Modal
              isOpen={showErrorModal}
              toggle={toggleErrorModal}
              centered
              size="lg"
            >
              <ModalBody className="text-34 bg-black text-white border-gold rounded p-5">
                Phantom wallet is not installed
                <div className="m-auto w-fitContent mt-lg-5 mt-3">
                  <Button
                    className="btn-warning rounded-13 text-24 fw-bold px-lg-3 py-lg-2 py-0 px-3 me-3"
                    onClick={toggleErrorModal}
                  >
                    Dismiss
                  </Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div className="w-100 pb-2 mx-auto">
          <div className="line mt-5 text-center pt-3">© 2021 SolShaman</div>
        </div>
      </div>
    </div>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default HomeHero;
