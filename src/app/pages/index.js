import Image from 'next/image'
import styles from '../page.module.css'
// import { Single_Day } from 'next/font/google';
// import overlap from './output.json';
import RenderCircle from '../components/RenderCircle';
import Map from '../components/Map';
import { getData } from './utils/serverComponent';

export async function getServerSideProps(context) {
  console.log('sflwl')
  if(context){
    console.log('context', context)
    const { lon, lat } = context.query;
    const data = await getData(lon, lat);
  
    return {
      props: {
        data,
      },
    };
  } else{
    console.log('else')
    const lon = -80.08468071724317
    const lat = 42.12912811069792
    const data = await getData(lon, lat);
  
    return {
      props: {
        data,
      },
    };
  }
  
}


export default function Graphic({ data }) {
  console.log('37', data)
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await getData(-80.08468071724317, 42.12912811069792);
  //       setData(result);
  //       console.log(result);
  //     } catch (error) {
  //       console.error('Error fetching data:', error.message);
  //     }
  //   };

  //   fetchData();
  // }, []); // Empty dependency array ensures the effect runs once on mount

  // if (!data) {
  //   // Render loading state or return null
  //   return null;
  // }

  // const begin = data.properties.local_data.filter(item => item.phenomenon === 'Eclipse Begins')[0];
  // const end = data.properties.local_data.filter(item => item.phenomenon === 'Eclipse Ends')[0];

  // const beginVertexAngle = Math.round(parseFloat(begin.vertex_angle));
  // const endVertexAngle = Math.round(parseFloat(end.vertex_angle));
  // const midVertexAngle = Math.round((beginVertexAngle + endVertexAngle) / 2);
  // console.log(beginVertexAngle, endVertexAngle)
  

  return (
    // <Image
    //   className={styles.logo}
    //   src="/next.svg"
    //   alt="Next.js Logo"
    //   width={180}
    //   height={37}
    //   priority
    // />
    <main className={styles.main}>
      {/* <svg className={styles.graphic} width={600} height={600}>
        <RenderCircle
          beginVertexAngle={beginVertexAngle}
          endVertexAngle={endVertexAngle}
          midVertexAngle={midVertexAngle}
          obscuration={data.properties.obscuration}
        />
      </svg>

      <div className={styles.grid}>
        tktk
      </div>
      <Map /> */}
    </main>
  )
}