import React, { useEffect } from "react";
import { Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import People from "./People";
import { fetchInfluencerList, setShowPeople } from "./redux/actions";

const PeopleLoader = () => {
	return (
		<div className='container px-3 lg:px-0 mx-auto pt-5'>
			<Skeleton.Input active={true} className='w-1/2 h-10 mb-9' />
			<div className='flex flex-col lg:flex-row'>
				<div className='h-134 lg:h-700 lg:max-w-sm w-full'>
					<Skeleton.Input
						active={true}
						className='h-134 lg:h-700 lg:max-w-sm w-full'
					/>
				</div>
				<div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 lg:pl-5 pt-3 lg:pt-0'>
					<Skeleton.Input active={true} className='lg:max-w-480 h-full' />
					<Skeleton.Input active={true} className='lg:max-w-480 h-full' />
					<Skeleton.Input active={true} className='lg:max-w-480 h-full' />
					<Skeleton.Input active={true} className='lg:max-w-480 h-full' />
				</div>
			</div>
		</div>
	);
};

const PeopleList = () => {
	const [influencerList, isFetching] = useSelector((state) => [
		state.appState?.people?.list || [],
		state.appState?.people?.fetching,
	]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (influencerList?.length === 0) {
			dispatch(fetchInfluencerList());
		}
	}, []);

	const onBack = () => {
		dispatch(setShowPeople(false));
	};

	return (
		<div className='mx-3 sm:container sm:mx-auto'>
			<div className='lg:max-w-6xl-1 mx-auto'>
				<div
					className='flex items-center cursor-pointer pt-7 lg:pt-0 max-w-max'
					onClick={onBack}>
					<ArrowLeftOutlined className='text-xl leading-none text-black-200 flex' />
					<span className='pl-4 text-xl font-medium'>Back</span>
				</div>
				{isFetching ? (
					<PeopleLoader />
				) : (
					influencerList?.map((people) => (
						<People data={people} closePeople={onBack} />
					))
				)}
			</div>
		</div>
	);
};

export default PeopleList;
