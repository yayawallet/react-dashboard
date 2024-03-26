import Header from './common/Header'
import Sidebar from './common/Sidebar'
import Main from './Main'

const Dashboard = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <div className="sm:ml-64">
        <Main />
      </div>
    </>
  )
}

export default Dashboard
