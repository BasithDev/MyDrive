import { useState } from "react";
import Header from "./components/Header";
import FileView from "./components/FileView";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to trigger file list refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Header onUploadSuccess={triggerRefresh} />
      <FileView refreshTrigger={refreshTrigger} />
    </>
  );
}

export default App;