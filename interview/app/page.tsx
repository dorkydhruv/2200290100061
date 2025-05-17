import { useState } from "react";

interface ExpenseData{
  title"Stirn,

}

export default function Home() {
  const [dummyData,useDummyState] = useState([{
    title: "Groceries",
    timestamp: "Apr 25,2024",
    amount: "85.75",
  },
  {
    title: "Electricity Bill",
    timestamp: "Apr 20,2024",
    amount: "120.50",
  },
  {
    title: "Movie Tickets",
    timestamp: "Apr 15,2024",
    amount: "32.00",
  }])
  return (
    <div>
      <div>
      Total Expenses

      </div>
      <div>
        All Expenses <button onClick={()=>useDummyState([...dummyData,{
          title:"",
          timestamp:`${Date.now().}`,
          amount:"20"
        }])}></button>
        {dummyData.map((data)=>{
          return <div key={data.timestamp}>
            <div>
              <h4>{data.title}</h4>
              <p>{data.timestamp}</p>
            </div>
            <div>
              <h3>{data.amount}</h3>
              <Delete/>
            </div>
          </div>
        })}
      </div>
    </div>
  );
}

function Delete(){
  return <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
</svg>
}