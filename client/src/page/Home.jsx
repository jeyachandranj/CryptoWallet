import { Navbar, Welcome, Footer, Services, Transactions } from "../components";

const Home = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <Footer />
  </div>
);

export default Home;
