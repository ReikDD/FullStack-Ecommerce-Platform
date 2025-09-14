import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

// Define order status progress sequence
const ORDER_STATUS_SEQUENCE = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered"
];

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [filteredOrders, setFilteredOrders] = useState([])
  const navigate = useNavigate()

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        console.log("Admin orders received:", response.data.orders);
        const sortedOrders = response.data.orders.sort((a, b) => b.date - a.date);
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  useEffect(() => {
    if (filterStatus) {
      setFilteredOrders(orders.filter(order => order.status === filterStatus))
    } else {
      setFilteredOrders(orders)
    }
  }, [filterStatus, orders])

  const statusHandler = async (event, orderId) => {
    try {
      const currentDate = new Date();
      const response = await axios.post(backendUrl + '/api/order/status', {
        orderId,
        status: event.target.value,
        statusChangeDate: currentDate
      }, { headers: { token } });

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  // Run one-time migration to add orderId to existing orders
  const migrateOrderIds = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/migrateOrderIds', {}, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to migrate order IDs");
    }
  };

  const viewOrderDetail = (orderId) => {
    navigate(`/order-detail/${orderId}`);
  };

  // Function to get available status options based on current status
  const getAvailableStatusOptions = (currentStatus) => {
    if (!currentStatus) return ORDER_STATUS_SEQUENCE;
    
    const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);
    if (currentIndex === -1) return ORDER_STATUS_SEQUENCE;
    
    // Return current status and all statuses that come after it
    return ORDER_STATUS_SEQUENCE.slice(currentIndex);
  };

  return (
    <div>
      <h3>Order Page</h3>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label>Filter Order Status:</label>
          <select value={filterStatus} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <button 
          onClick={migrateOrderIds}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Order ID to Existing Orders
        </button>
      </div>
      <div>
        {filteredOrders.map((order, index) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
            <div className='font-bold'>Order ID: #{order.orderId || 'Not set'}</div>
            <img className='w-12' src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                  }
                  else {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : { order.payment ? 'Done' : 'Pending' }</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              {order.statusChangeDate && <p>Status Change Date: {new Date(order.statusChangeDate).toLocaleDateString()}</p>}
            </div>
            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
            <div className="flex flex-col gap-2">
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                {getAvailableStatusOptions(order.status).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => viewOrderDetail(order._id)} 
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders