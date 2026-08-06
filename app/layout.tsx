import type {Metadata} from 'next';
import './globals.css';
import './calendar.css';
export const metadata:Metadata={title:'Cliff House at Canyon Lake | Book Direct',description:'Book your Canyon Lake waterfront getaway directly. Sleeps 10 with a hot tub, two decks, grill station and firepit.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
