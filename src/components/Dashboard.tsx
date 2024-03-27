import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";

const Dashboard = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <div className="sm:ml-64">
        <Main />
      </div>
    </>
  );
};

export default Dashboard;
