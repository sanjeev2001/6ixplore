import React, { useState, useEffect, useRef } from "react";
import './PlanBox.css'
import { useUser } from '../../UserSession'
import unlike from '../../assets/xSmall.svg'
import calPlus from '../../assets/caladd.svg'
import CallAdd from "../calendarAdd/CalAdd";
import CalLink from "../calendarAdd/calLink";


export default function PlanBox({planID}) {

    let [userEvents, setUserEvents] = useState(null);
    const {user} = useUser();
    const deleteEventFromPlan = async (eventID) => {

        const planObj = {
            "userId": user,
            "itemId" : eventID,
            "planId": planID
        }

        try {
            const resp =  fetch(`http://localhost:5000/users/deletePlan`, {
              method: "delete",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(planObj)
            });
            if (resp.ok) {
              console.log("Removed");
            }
          }catch (error) {
            console.log(error);
            return null;
          }
    }
    useEffect (() =>{
        const fetchUserPlan = async () => {
          try {
                const resp = await fetch(`http://localhost:5000/users/${user}-${planID}/getPlan`);
                const json = await resp.json();
                //console.log("user plan", json.planItem);
                let planEventList = [];
                for (const event of json.planItem) {
                    try {
                        const resp = await fetch(`http://localhost:5000/item/${event}`);
                        const eventJson = await resp.json();
                        //console.log(eventJson);
                        planEventList.push(eventJson);
                    } catch (error) {
                        console.log("error", error);
                    }
                }
                setUserEvents(planEventList);
                //console.log("UserEvents: ", userEvents);
          } catch (error) {
              console.log("error", error);
          }
        }; 

        fetchUserPlan();
      }, [userEvents]);

    if(userEvents == null)
      return;

    return (
        <>
        {userEvents?.map((event) => (
            <>
            <div className="planBox">
            <div className="planBox-header">
                <div className="nameEvent"> 
                  {event.name}
                </div>
                <div className="planBox-button" >
                  <div className="addF">
                    <CalLink events={event} />
                  </div>
                  <CallAdd events={event} />
                  <img onClick={() => deleteEventFromPlan(event._id)} src={unlike} alt=""/>
                </div>
            </div>
            <div className="planBox-body">
                <div>
                    {event.address}
                </div>
            </div>
            </div>
            </>
          ))}
        </>
    );
}