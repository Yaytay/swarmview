
import { ReactNode, useState} from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SectionProps {
  id: string;
  heading: string;
  level: number;
  children: ReactNode;
}
function Section(props: SectionProps) {

  const HeaderTag = `h${props.level}` as keyof JSX.IntrinsicElements;

  const [expanded, setExpanded] = useState(() => {
    const storedValue = localStorage.getItem(props.id) 
    console.log('Stored value ' + props.id + ': ', storedValue)
    return storedValue === null || storedValue === 'true'
  })

  const handleChange =
    () => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded);
      console.log('Props', props)
      localStorage.setItem(props.id, isExpanded.toString());
    };

  return (
      <Accordion expanded={expanded} onChange={handleChange()} className='section' sx={{width: '100%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            <HeaderTag>
              {props.heading}
            </HeaderTag>
        </AccordionSummary>
        <AccordionDetails sx={{width: '100%'}}>
          {props.children}
        </AccordionDetails>
      </Accordion>
  )


}

export default Section;