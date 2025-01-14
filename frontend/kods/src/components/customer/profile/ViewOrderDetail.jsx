import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Rating,
  Modal
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getOrderbyOrderId, getOrderDetailsByOrderId } from '../../api/OrdersApi'; // Import the API function
import { addFeedback } from '../../api/FeedbackApi'; // Import the API function
import { getFeedbackByOrderId, deleteFeedback } from '../../api/FeedbackApi'; // Import the delete API function
import '../../../css/ViewOrderDetail.css'; // Import the new CSS file

export default function OrderDetail({ onBack }) {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null); // State to hold general order details
  const [orderDetailById, setOrderDetailById] = useState(null); // State to hold order details by ID
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submittedFeedback, setSubmittedFeedback] = useState(null); // Add this line
  const [feedbackData, setFeedbackData] = useState(null); // State to hold feedback data
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const order = await getOrderbyOrderId(orderId);
        setOrderDetail(order);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }

    async function fetchOrderDetailByOrderId() {
      try {
        const orderbyId = await getOrderDetailsByOrderId(orderId);
        setOrderDetailById(orderbyId);
        console.log('Order details by ID:', orderbyId); // Log the orderDetailById data
      } catch (error) {
        console.error('Error fetching order details by ID:', error);
      }
    }

    async function fetchFeedback() {
      try {
        const feedback = await getFeedbackByOrderId(orderId);
        setFeedbackData(feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    }
    fetchOrderDetail();
    fetchOrderDetailByOrderId();
    fetchFeedback();
  }, [orderId]);

  const handleDeleteFeedback = async () => {
    try {
      if (feedbackData && feedbackData.feedbackId) { // Use feedbackData.feedbackId
        await deleteFeedback(feedbackData.feedbackId); // Use feedbackData.feedbackId
        console.log(`Feedback with ID ${feedbackData.feedbackId} deleted successfully.`);
        setFeedbackData(null); // Clear the feedback data
        setFeedback(''); // Reset feedback input
        setRating(0); // Reset rating
      } else {
        console.log('No feedback to delete.');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      const plainTextComment = feedback.replace(/<[^>]+>/g, ''); // Strip HTML tags

      const feedbackData = {
        comment: plainTextComment, // Use plain text comment
        rating,
        orderId: parseInt(orderId, 10),
        customerId: orderDetail.customerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Submitting feedback with data:', feedbackData);

      const response = await addFeedback(feedbackData);

      setSubmittedFeedback(response);

      console.log('Feedback submitted successfully:', response);

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleViewAllStatus = (healthStatus) => {
    setSelectedStatuses(healthStatus);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!orderDetail) {
    return <Typography variant="h6">Order not found</Typography>;
  }

  return (
    <div className="full-page-background">
      <div className="order-detail-container">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/profile/ViewOrderHistory')}
          style={{ marginBottom: '20px' }}
        >
          Go Back
        </Button>
        <Typography variant="h4" gutterBottom>
          Order Details {orderDetail.code}
        </Typography>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column' }}>
            <Paper style={{ padding: '20px', flex: 1, border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h6" gutterBottom><strong>Sender Information</strong></Typography>
              <Typography><strong>Name:</strong> {orderDetail.senderName}</Typography>
              <Typography><strong>Address:</strong> {orderDetail.senderAddress}</Typography>
              <Typography><strong>Phone:</strong> {orderDetail.senderPhoneNumber}</Typography>
              <Typography><strong>Order Created At:</strong> {orderDetail.createdAt}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column' }}>
            <Paper style={{ padding: '20px', flex: 1, border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h6" gutterBottom><strong>Receiver Information</strong></Typography>
              <Typography><strong>Name:</strong> {orderDetail.recipientName}</Typography>
              <Typography><strong>Address:</strong> {orderDetail.recipientAddress}</Typography>
              <Typography><strong>Email:</strong> {orderDetail.recipientEmail}</Typography>
              <Typography><strong>Phone:</strong> {orderDetail.recipientPhoneNumber}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom><strong>Order Information</strong></Typography>
              <Typography><strong>Payment Method:</strong> {orderDetail.paymentMethod}</Typography>
              <Typography><strong>Payment Status:</strong> {orderDetail.paymentStatus}</Typography>
              <Typography><strong>Delivery Status:</strong> {orderDetail.deliveryStatus}</Typography>
              <Typography><strong>Total Weight:</strong> {orderDetail.totalWeight} kg</Typography>
              <Typography><strong>Total Cost:</strong> {orderDetail.totalCost.toLocaleString('vi-VN')} VND</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fish Name</strong></TableCell>
                    <TableCell><strong>Health Status</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetailById && orderDetailById.map((item) => (
                    <TableRow key={item.fishProfileId}>
                      <TableCell>{item.fishProfile.name}</TableCell>
                      <TableCell>
                        {item.healthStatus.length > 0 ? (
                          item.healthStatus.map((status, index) => {
                            const date = new Date(status.date);
                            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                            return (
                              <div key={index}>
                                {formattedDate}: {status.status}
                              </div>
                            );
                          })
                        ) : (
                          <div>No health status available</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewAllStatus(item.healthStatus)}
                        >
                          View All Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {orderDetail.deliveryStatus === 'DELIVERED' && (
            <Grid item xs={12}>
              <Paper style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>Feedback and Rating</Typography>
                {feedbackData ? (
                  <div>
                    <Typography>Comment: {feedbackData.comment}</Typography>
                    <div style={{ marginBottom: '20px' }}>
                      <Rating
                        name="read-only"
                        value={feedbackData.rating}
                        readOnly
                      />
                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDeleteFeedback}
                    >
                      Delete Feedback
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Rating
                      name="simple-controlled"
                      value={rating}
                      onChange={(event, newValue) => setRating(newValue)}
                      style={{ marginBottom: '20px' }}
                    />
                    <ReactQuill value={feedback} onChange={(content) => setFeedback(content)} />
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: '20px' }}
                      onClick={handleFeedbackSubmit}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Paper
            style={{
              padding: '20px',
              margin: '20px auto',
              maxWidth: '1500px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Typography variant="h6" id="modal-title">All Health Statuses</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Temperature</TableCell>
                    <TableCell>Oxygen</TableCell>
                    <TableCell>phLevel</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStatuses.length > 0 ? (
                    selectedStatuses.map((status, index) => {
                      const date = new Date(status.date);
                      const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                      return (
                        <TableRow key={index}>
                          <TableCell>{formattedDate}</TableCell>
                          <TableCell>{status.status}</TableCell>
                          <TableCell>{status.temperature}</TableCell>
                          <TableCell>{status.oxygenLevel}</TableCell>
                          <TableCell>{status.phLevel}</TableCell>
                          <TableCell>{status.notes}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No health status available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={handleClose} variant="contained" color="secondary" style={{ marginTop: '20px' }}>
              Close
            </Button>
          </Paper>
        </Modal>
      </div>
    </div>
  );
}
