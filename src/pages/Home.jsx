import ButtonGradient from "../assets/svg/ButtonGradient";
import Benefits from "../component/Benefits";
import Footer from "../component/Footer";
import Header from "../component/Header";
import Hero from "../component/Hero";
import Services from "../component/Services";
import TechStack from "../component/TechStack";

const Home = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Services />
        <Benefits />
        <TechStack />
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default Home;
