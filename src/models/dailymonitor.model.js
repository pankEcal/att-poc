const defalutValues = {
	defaultStatus: false,
	defaultMessage: "Incorrect url",
};

const apis = [
	"http://tvseoldev.enginecal.com/event",
	"http://tvseoldev.enginecal.com/core",
	"https://evaeol.tvsmotor.com/event",
	"https://evaeol.tvsmotor.com/core",
	"http://tvsrdsdev.enginecal.com/event",
	"http://tvsrdsdev.enginecal.com/core",
	"https://evards.tvsmotor.com/event",
	"https://evards.tvsmotor.com/core",
	"http://evactr.enginecal.com/event",
	"http://evactr.enginecal.com/core",
	"http://tvsctrdev.enginecal.com/event",
	"http://tvsctrdev.enginecal.com/core",
	"http://tvsrdsdev.enginecal.com/event",
	"http://tvsrdsdev.enginecal.com/core",
	"https://evards.tvsmotor.com/event",
	"https://evards.tvsmotor.com/core",
	"http://evaaidev.enginecal.com/event",
	"http://evaaidev.enginecal.com/core",
	"http://evaai.enginecal.com/event",
	"http://evaai.enginecal.com/core",
];

function getDefaultResopnseValues() {
	return defalutValues;
}

function getApisList() {
	return apis;
}

module.exports = { getDefaultResopnseValues, getApisList };
