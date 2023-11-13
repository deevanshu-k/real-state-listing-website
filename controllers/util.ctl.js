const Constant = require("../config/constant");
const stateCityData = require("../states-cities.json");

let utilControllers = {};

utilControllers.getAllStates = (req, res) => {
    try {
        let data = stateCityData.map(d => {
            return {
                code: d.code,
                name: d.name
            }
        });

        res.status(Constant.SUCCESS_CODE).json(data);
    } catch (error) {
        res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        });
    }
}

utilControllers.getAllCities = (req, res) => {
    try {
        let { code } = req.params;
        let data = [];
        for (let i = 0; i < stateCityData.length; i++) {
            if(stateCityData[i].code === code){
                data = stateCityData[i].cities
                break;
            }
        }

        res.status(Constant.SUCCESS_CODE).json(data);
    } catch (error) {
        console.log(error);
        res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        });
    }
}

module.exports = utilControllers;