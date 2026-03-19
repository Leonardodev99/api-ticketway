import Seat from '../models/Seat.js';

class SeatGeneratorService {

  static async generateForSchedule(scheduleId, busId, totalSeats) {
    const seats = [];
    const now = new Date();

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        seat_number: i,
        bus_id: busId,
        schedule_id: scheduleId,
        status: 'available',
        created_at: now,
        updated_at: now,
      });
    }

    await Seat.bulkCreate(seats);
  }
}

export default SeatGeneratorService;
