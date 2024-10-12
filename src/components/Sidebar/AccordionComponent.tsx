import supabase from "@/lib/supabaseClient";
import { SubtopicsDataTypes, TopicsDataTypes } from "@/utils/types";
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import { IoHardwareChipOutline } from "react-icons/io5";
import { BiMoviePlay } from "react-icons/bi";
import Link from "next/link";


type AccordionComponentProps = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccordionComponent({setIsSidebarOpen}: AccordionComponentProps) {
  const [topics, setTopics] = useState<TopicsDataTypes[] | null>([]);
  const [subtopics, setSubtopics] = useState<SubtopicsDataTypes[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Tüm topics çekiyoruz
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select('*');
  
        if (topicsError) throw topicsError;
        if (!topicsData) throw new Error(`No topics found`);
        setTopics(topicsData); 

        // Tüm subtopics çekiyoruz
        const { data: subtopicsData, error: subtopicsError } = await supabase
          .from('subtopics')
          .select('*');
  
        if (subtopicsError) throw subtopicsError;
        if (!subtopicsData) throw new Error(`No topics found`);
        setSubtopics(subtopicsData); 

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);

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
