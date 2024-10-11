// "use client"
// import { useState } from 'react';
// import { useGeneralContext } from '@/context/GeneralContext';

// //mer ha
// const Sidebar = () => {
//     const { isSidebarOpen, setIsSidebarOpen } = useGeneralContext();
//   return (
//     <div>
//         {/* Sidebar */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40">
//           <div className="fixed top-0 left-0 w-64 bg-white h-full shadow-md z-50">
//             <button
//               className="p-4"
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               Close Sidebar
//             </button>
//             {/* Sidebar content goes here */}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Sidebar

// src/components/Sidebar.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useGeneralContext } from '@/context/GeneralContext';
import { useFetchContext } from '@/context/FetchContext';
import {TopicsDataTypes, SubtopicsDataTypes} from '@/utils/types'
import supabase from '@/lib/supabaseClient';
import AccordionComponent from './AccordionComponent';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGeneralContext();
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
    <div className='overflow-auto '>
      {/* Sidebar, md ekran boyutlarında (768px ve üzeri) her zaman gösterilecek */}
      <div className="hidden md:flex w-[272px] bg-white h-full shadow-md">
        {/* Sidebar içeriği */}
        <div className="p-4 w-full">
          <h2 className="text-xl text-gray-500">Topics</h2>
          <AccordionComponent />
          
        </div>
      </div>

      {/* Küçük ekranlarda (md altı) sidebar'ı gösteriyoruz */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden" // md:hidden ile md ve üzeri boyutlarda gizleniyor
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="fixed top-0 left-0 w-[272px] bg-white h-full shadow-md z-50">
            <button className="p-4 text-2xl" onClick={() => setIsSidebarOpen(false)}>
              x
            </button>
            <div className="p-4 ">
              <h2 className="text-xl font-semibold">Sidebar Content</h2>
              <AccordionComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
