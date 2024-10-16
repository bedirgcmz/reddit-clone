import Accordion from 'react-bootstrap/Accordion';
import { FaRegSmileBeam } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import { IoHardwareChipOutline } from "react-icons/io5";
import { BiMoviePlay } from "react-icons/bi";
import Link from "next/link";
import { useFetchContext } from "@/context/FetchContext";


type AccordionComponentProps = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccordionComponent({setIsSidebarOpen}: AccordionComponentProps) {
  const {topics, subtopics} = useFetchContext()

  return (
    <Accordion alwaysOpen>
      {
        topics && topics.length > 0 ? (
          topics.map((item, index) => (
            <Accordion.Item key={item.id} eventKey={`${index}`}>
               <Accordion.Header>
                {index == 0 && <FaRegSmileBeam/>}
                {index == 1 && <IoGameControllerOutline/>}
                {index == 2 && <IoHardwareChipOutline/>}
                {index == 3 && <BiMoviePlay/>}
                <span className="ms-2">
                {item.name}
                </span>
                </Accordion.Header>
               <Accordion.Body >
                  <ul className="my-2">
                    {subtopics?.filter((e) => e.topic_id === item.id).map((subtopic) => (
                      <Link href={`/c/${subtopic.slug}` } key={subtopic.id} >
                          <li  className="py-1" onClick={() => setIsSidebarOpen(false)}>{subtopic.name}</li>
                      </Link>
                    ))}
                  </ul>

               </Accordion.Body>
              </Accordion.Item>
            ))
          ) : (
            <Accordion.Item eventKey="not-found"> Loading topics...</Accordion.Item>
          )
      }
  </Accordion>
  );
}
