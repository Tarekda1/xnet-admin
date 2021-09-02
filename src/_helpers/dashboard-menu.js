const getdashboardMenu = (role = 'ADMIN') => {
	console.log(role);
	if (role == 'ADMIN') {
		const adminMenuarr = [
			[
				{
					menuText: 'Customer Signup',
					path: '/admin/customers'
				},
				{
					menuText: 'List of agents',
					path: '/admin/agents'
				},
				{
					menuText: 'List of products',
					path: '/admin/products'
				},
				{
					menuText: 'Customer Data Download',
					path: '/admin/customers/report'
				},
				{
					menuText: '+',
					path: ''
				}
			],
			[
				{
					menuText: '+',
					path: ''
				},
				{
					menuText: '+',
					path: ''
				}
			]
		];
		return adminMenuarr;
	}
	const agentMenu = [
		[
			{
				menuText: 'List of customer',
				path: '/customer'
			},
			{
				menuText: 'Add Customer',
				path: '/customer/add'
			}
		]
	];
	return agentMenu;
};

export { getdashboardMenu };
