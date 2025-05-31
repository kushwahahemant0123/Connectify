import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import withAuth from '../utils/WithAuth'


function History() {

  const { getHistoryOfUser, deleteHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);


  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (error) {
        //implement snakbar
      }
    }
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`
  }
  return (
    <div>
      <div className="nav" style={{ display: "flex", justifyContent: 'space-between' }}>
        <IconButton onClick={() => {
          routeTo('/home')
        }}>
          <HomeIcon />
        </IconButton>
        <Button onClick={async () => {
          console.log("delete button");
          try {
            await deleteHistoryOfUser();
            setMeetings([]);
          } catch (error) {
            console.log(error)
          }

        }}>
          <DeleteIcon />Delete History
        </Button>
      </div>

      {meetings.length > 0 ?
        meetings.map(e => {
          return (<>

            <Card variant="outlined">
              <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Code: {e.meetingCode}
                </Typography>

                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Date: {formatDate(e.date)}</Typography>

              </CardContent>

            </Card>
          </>)
        })
        : <><p>Empty</p></>}

    </div>
  )
}


export default withAuth(History);