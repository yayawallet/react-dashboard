import Create from './Create';
import List from './List';

const Index = () => {
  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Scheduled Payments</h1>

      <Create />
      <List />
    </div>
  );
};

export default Index;
