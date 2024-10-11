import supabase from "@/lib/supabaseClient";
import { SubtopicsDataTypes, TopicsDataTypes } from "@/utils/types";
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from "react";


export default function AccordionComponent() {
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
               <Accordion.Header>{item.name}</Accordion.Header>
               <Accordion.Body >
                  <ul className="my-2">
                    {subtopics?.filter((e) => e.topic_id === item.id).map((subtopic) => (
                      <li key={subtopic.id} className="py-1">{subtopic.name}</li>
                    ))}
                  </ul>

               </Accordion.Body>
              </Accordion.Item>
            ))
          ) : (
            <Accordion.Item eventKey="not-found"> No topics found</Accordion.Item>
          )
      }
  </Accordion>
  );
}
