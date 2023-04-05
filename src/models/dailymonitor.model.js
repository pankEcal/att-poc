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

const apisWithApplications = [
	{
		application: "EOL Application Dev",
		urls: [
			"http://tvseoldev.enginecal.com/event",
			"http://tvseoldev.enginecal.com/core",
		],
	},

	{
		application: "EOL Application Prod",
		urls: [
			"https://evaeol.tvsmotor.com/event",
			"https://evaeol.tvsmotor.com/core",
		],
	},

	{
		application: "RideOScope Dev",
		urls: [
			"http://tvsrdsdev.enginecal.com/event",
			"http://tvsrdsdev.enginecal.com/core",
		],
	},

	{
		application: "RideOScope Prod",
		urls: [
			"https://evards.tvsmotor.com/event",
			"https://evards.tvsmotor.com/core",
		],
	},

	{
		application: "CTR Dev Demo",
		urls: [
			"http://evactr.enginecal.com/event",
			"http://evactr.enginecal.com/core",
		],
	},

	{
		application: "TVS CTR Dev",
		urls: [
			"http://tvsctrdev.enginecal.com/event",
			"http://tvsctrdev.enginecal.com/core",
		],
	},

	{
		application: "IntelliRide Dev",
		urls: [
			"http://tvsrdsdev.enginecal.com/event",
			"http://tvsrdsdev.enginecal.com/core",
		],
	},

	{
		application: "IntelliRide Prod",
		urls: [
			"https://evards.tvsmotor.com/event",
			"https://evards.tvsmotor.com/core",
		],
	},

	{ application: "eva.enginecal.com", urls: [] },

	{
		application: "Eva AI dev",
		urls: [
			"http://evaaidev.enginecal.com/event",
			"http://evaaidev.enginecal.com/core",
		],
	},

	{
		application: "Eva AI prod",
		urls: [
			"http://evaai.enginecal.com/event",
			"http://evaai.enginecal.com/core",
		],
	},

	{ application: "EngineInsight Dev", urls: [] },

	{ application: "EngineInsight Prod", urls: [] },

	{ application: "Eva fleet Dev", urls: [] },

	{ application: "Eva fleet Prod", urls: [] },
];

function getDefaultResopnseValues() {
	return defalutValues;
}

function getApisList() {
	return apis;
}

function getApisListWithApplication() {
	return apisWithApplications;
}

module.exports = {
	getDefaultResopnseValues,
	getApisList,
	getApisListWithApplication,
};
