import React, { useState, useEffect } from "react";
import TreeNode from "../components/Treenode";
import Sidebar from "../components/Sidebar";

const ReferralTree = () => {
  const [childData, setData] = useState([]);
  const randomId = localStorage.getItem("rootID"); // The root ID

   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch(
           `http://ec2-13-126-194-20.ap-south-1.compute.amazonaws.com:5000/api/getDetails?randomId=${randomId}`
         );

         if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
         }

         const fetchedData = await response.json();
         setData(fetchedData);

       } catch (error) {
         console.error("Error fetching data", error);
       }
     };

     if (randomId) {
       fetchData();
     }
   }, [randomId]);


  // Build the tree structure
  const buildTree = (rootData, childData) => {
    if (!rootData) return null;

    // The root node is the first node in the tree
    const rootNode = {
      ...rootData,
      children: childData.map((child) => ({
        ...child,
        children: [], // We will not have further levels of children for now
      })),
    };

    return rootNode;
  };

  // Build the tree with the fetched data
  const treeData = buildTree(randomId, childData);

  return (
    <div style={{ display: "flex" }}>
      <section>
        <Sidebar />
      </section>
      <section>
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          {treeData ? <TreeNode node={treeData} /> : <p>Loading...</p>}
        </div>
      </section>
    </div>
  );
};

export default ReferralTree;
