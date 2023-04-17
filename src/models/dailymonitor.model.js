const defalutValues = {
	defaultStatus: false,
	defaultMessage: "Incorrect url",
};

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
	const apis = [];
	apisWithApplications.map((item) => item.urls.map((url) => apis.push(url)));

	return apis;
}

function getApplicationsList() {
	const applications = [];
	apisWithApplications.map((item) => applications.push(item.application));

	return applications;
}

function getApisListWithApplication() {
	return apisWithApplications;
}

function getValidApisWithApplication() {
	const validApis = [];

	apisWithApplications.map((api) => {
		const { application } = api;

		api.urls.map((url) => {
			validApis.push({
				application: application,
				url: url,
			});
		});
	});

	return validApis;
}

module.exports = {
	getDefaultResopnseValues,
	getApisList,
	getValidApisWithApplication,
	getApisListWithApplication,
	getApplicationsList,
};
