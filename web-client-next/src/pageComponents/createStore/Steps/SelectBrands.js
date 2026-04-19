import React from "react";
import { Row, Col, Badge, Card } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";

const SelectBrands = ({ brandList, selectedBrands, handleBrandsChange }) => {
	const onBrandSelect = (id) => {
		if (selectedBrands.includes(id)) {
			const newItems = selectedBrands.filter((i) => i !== id);
			handleBrandsChange(newItems);
		} else {
			handleBrandsChange([...selectedBrands, id]);
		}
	};

	return (
		<div>
			<Row gutter={[20, 20]}>
				{brandList.map((brand) => (
					<Col sm={6} lg={4} span={12} key={brand.brand}>
						<div className='relative w-full profile-brand-wrapper'>
							<div className='absolute top-0 right-0 bottom-0 left-0'>
								<div className='transition duration-300 ease-in-out transform hover:scale-110 bg-white h-full'>
									<Badge
										size='default'
										count={
											<CheckOutlined
												onClick={() => onBrandSelect(brand.brand)}
												className={`rounded-full bg-green-600 p-1 text-white ${selectedBrands.includes(brand.brand)
													? "block"
													: "hidden"
													}`}
											/>
										}
										className='w-full h-full'>
										<div
											onClick={() => onBrandSelect(brand.brand)}
											className='bg-white flex justify-center items-center card-shadow text-lg cursor-pointer p-1 h-full relative overflow-hidden'>
											{brand.logo && (
												<div className='absolute inset-0 w-full h-full'>
													<LazyLoadImage
														src={brand.logo}
														alt={brand.brand}
														width='100%'
														height='100%'
														effect='blur'
														className='object-cover w-full h-full blur-sm opacity-50'
													/>
												</div>
											)}
											<span className='font-bold break-all text-center capitalize relative z-10 px-2'>
												{brand.brand}
											</span>
										</div>
									</Badge>
								</div>
							</div>
						</div>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default SelectBrands;
