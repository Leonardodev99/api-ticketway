import Seat from '../models/Seat.js';

class SeatGeneratorService {

  // SeatGeneratorService.js
  static async generate(busId, totalSeats) {
    const seats = [];

    const now = new Date(); // timestamp único

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        seat_number: i,
        bus_id: busId,
        status: 'available',
        created_at: now,   // ✅ precisa
        updated_at: now,   // ✅ precisa
      });
    }

    await Seat.bulkCreate(seats);
  }
}

export default SeatGeneratorService;
