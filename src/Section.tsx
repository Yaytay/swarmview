import './Section.css'

import { ReactNode, useState} from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

interface SectionProps {
  id: string;
  heading: string;
  xs?: number;
  children: ReactNode;
}
function Section(props: SectionProps) {

  const [expanded, setExpanded] = useState(() => {
    const storedValue = localStorage.getItem(props.id) 
    return storedValue === null || storedValue === 'true'
  })

  const handleChange =
    () => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded);
      localStorage.setItem(props.id, isExpanded.toString());
    };

  return (
    <Grid item xs={props.xs}>
      <Accordion expanded={expanded} onChange={handleChange()} className='section' sx={{width: '100%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            <h2>
              {props.heading}
            </h2>
        </AccordionSummary>
        <AccordionDetails sx={{width: '100%' }}>
          {props.children}
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default Section;