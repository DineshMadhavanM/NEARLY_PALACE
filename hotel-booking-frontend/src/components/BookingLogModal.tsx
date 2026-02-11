import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { BookingType } from "../../../shared/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
}

const BookingLogModal = ({ isOpen, onClose, hotelId, hotelName }: Props) => {
  const { data: bookings } = useQuery<BookingType[]>(
    ["fetchHotelBookings", hotelId],
    () => apiClient.fetchHotelBookings(hotelId),
    {
      enabled: !!hotelId && isOpen,
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-3xl font-bold mb-4">Bookings for {hotelName}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Guest</th>
                <th className="py-2 px-4 border-b">Dates</th>
                <th className="py-2 px-4 border-b">Guests</th>
                <th className="py-2 px-4 border-b">Total Cost</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {!bookings || bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center">No bookings found or loading...</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="py-2 px-4 border-b">{booking.firstName} {booking.lastName}<br /><span className="text-xs text-gray-500">{booking.email}</span></td>
                    <td className="py-2 px-4 border-b">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{booking.adultCount} Adults, {booking.childCount} Children</td>
                    <td className="py-2 px-4 border-b">£{booking.totalCost}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingLogModal;
