
// "use client";
// import React, { useEffect, useState } from 'react';
// import { useGeneralContext } from '@/context/GeneralContext';
// import { useFetchContext } from '@/context/FetchContext';
// import {TopicsDataTypes, SubtopicsDataTypes} from '@/utils/types'
// import supabase from '@/lib/supabaseClient';
// import AccordionComponent from './AccordionComponent';

// const Sidebar = () => {
//   const { isSidebarOpen, setIsSidebarOpen } = useGeneralContext();
//   const [topics, setTopics] = useState<TopicsDataTypes[] | null>([]);
//   const [subtopics, setSubtopics] = useState<SubtopicsDataTypes[] | null>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         // Tüm topics çekiyoruz
//         const { data: topicsData, error: topicsError } = await supabase
//           .from('topics')
//           .select('*');
  
//         if (topicsError) throw topicsError;
//         if (!topicsData) throw new Error(`No topics found`);
//         setTopics(topicsData); 

//         // Tüm subtopics çekiyoruz
//         const { data: subtopicsData, error: subtopicsError } = await supabase
//           .from('subtopics')
//           .select('*');
  
//         if (subtopicsError) throw subtopicsError;
//         if (!subtopicsData) throw new Error(`No topics found`);
//         setSubtopics(subtopicsData); 

//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchPosts();
//   }, []);
  

//   return (
//     <div className='overflow-auto '>
//       {/* Md Sidebar*/}
//       <div className="hidden md:flex w-[272px] bg-white h-full shadow-md">
//         <div className="p-4 w-full">
//           <h2 className="text-xl text-gray-500">Topics</h2>
//           <AccordionComponent />
//         </div>
//       </div>

//       {/* Modil Sidebar */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden" 
//         >
//           <div className="fixed top-0 left-0 w-[272px] bg-white h-full shadow-md z-50">
//             <button className="p-4 text-2xl float-right" onClick={() => setIsSidebarOpen(false)}>
//               x
//             </button>
//             <div className="p-4 ">
//               <h2 className="text-xl font-semibold">Sidebar Content</h2>
//               <AccordionComponent />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;


"use client";
import React, { useEffect, useState } from 'react';
import { useGeneralContext } from '@/context/GeneralContext';
import { useFetchContext } from '@/context/FetchContext';
import { TopicsDataTypes, SubtopicsDataTypes } from '@/utils/types';
import supabase from '@/lib/supabaseClient';
import AccordionComponent from './AccordionComponent';
import CreatePostModalButton from '../CreatePostModalButton';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, currentUser } = useGeneralContext();
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

  // Sidebar dışına tıklama işlevi
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsSidebarOpen(false);  // Sidebar'ı kapat
  };

  // Sidebar içine tıklama işlevi (tıklamanın kapanma olayını durdurması için)
  const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();  // Kapanma olayını durdur
  };

  return (
    <div className='overflow-auto '>
      {/* Md Sidebar*/}
      <div className="hidden md:flex flex-column w-[272px] bg-white h-full shadow-md">
      {currentUser && <div className="mb-2 w-full flex justify-end px-4"><CreatePostModalButton specialStyles='' /> </div>} 
        <div className="p-4 w-full">
          <h2 className="text-xl text-gray-500">Topics</h2>
          <AccordionComponent setIsSidebarOpen={setIsSidebarOpen}/>
        </div>
      </div>

      {/* Mobil Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden"
          onClick={handleOutsideClick}  
        >
          <div
            className="fixed top-0 left-0 w-[272px] pt-[20px] bg-white h-full shadow-md z-50"
            onClick={handleSidebarClick}  
          >
      {currentUser && <div className="mb-2 w-full flex justify-end px-4"><CreatePostModalButton specialStyles='' /> </div>} 
            <button className="p-4 text-2xl float-right" onClick={() => setIsSidebarOpen(false)}>
              x
            </button>
            <div className="p-4 ">
            <h2 className="text-xl text-gray-500">Topics</h2>
              <AccordionComponent setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
