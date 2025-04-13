const { BadRequestError } = require("../utils/error.response");
const CarModel = require('../models/car.model');
const CarAvailabilityModel = require('../models/carAvailability.model');
const { getAll, getMany, getOne, create, update, deleteOne } = require("../repositories/factory.repo");

class CarService {
    static createCar = async (carData) => {
        const car = await create(CarModel, carData);
        return car;
    }

    static getListCars = async (query) => {
        const popOptions = {
            path: 'location',
            select: 'name address'
        };
        const { total, docs: cars } = await getAll(CarModel, query, true, popOptions);
        return {
            total,
            result: cars.length,
            cars
        };
    }

    static getCarDetails = async (carId) => {
        const car = await getOne(CarModel, carId);
        if (!car) throw new BadRequestError('Car not found');
        return car;
    }

    static updateCar = async (carId, updateData) => {
        const car = await update(CarModel, carId, updateData);
        if (!car) throw new BadRequestError('Car not found');
        return car;
    }

    static deleteCar = async (carId) => {
        const car = await deleteOne(CarModel, carId);
        if (!car) throw new BadRequestError('Car not found');
        return null;
    }

    static checkAvailability = async ({ carId, startDate, endDate }) => {
        const availability = await CarAvailabilityModel.findOne({
            car: carId,
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
            isAvailable: true
        });

        return availability;
    }

    static createAvailability = async (availabilityData) => {
        const availability = await create(CarAvailabilityModel, availabilityData);
        return availability;
    }

    static updateAvailability = async (availabilityId, updateData) => {
        const availability = await update(CarAvailabilityModel, availabilityId, updateData);
        if (!availability) throw new BadRequestError('Availability not found');
        return availability;
    }

    static searchAvailableCars = async ({ location, startDate, endDate, type, capacity }) => {
        const query = {
            location,
            isActive: true
        };

        if (type) query.type = type;
        if (capacity) query.capacity = { $gte: capacity };

        const availableCars = await CarModel.find(query).populate('location', 'name address');

        const carsWithAvailability = await Promise.all(
            availableCars.map(async (car) => {
                const availability = await CarAvailabilityModel.findOne({
                    car: car._id,
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate },
                    isAvailable: true
                });

                if (availability) {
                    return {
                        ...car.toObject(),
                        availability
                    };
                }
                return null;
            })
        );

        return carsWithAvailability.filter(car => car !== null);
    }
}

module.exports = CarService; 