import './index.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const MainTemplete: React.FC = ({ children }) => {
  return (
    <div className='bg-black'>
      <div className=' app-max-width'>
        {/* <Header/> */}
           {children}
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default MainTemplete;