import React from "react";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable, arrayMoveMutable } from "array-move";

const SortableContainerWrapper = sortableContainer(({ children }) => {
	return <ul>{children}</ul>;
});

export default function SortableContainer({
	enableSelectProduct,
	onSelectProductClick,
	selectedProducts,
	items,
	onSortEnd,
	ItemComponent,
	sortableProps = {}, // to send extra params in react-sortable sortableContainer
	useMoveMutable = false,
	uniqueKey, // unique key in the items list
	...rest // extra common props to send in item component
}) {

	const SortableItem = sortableElement(({ value, setSelectValue, isSelected }) => {

		const handleSelectProduct = (e) => {
			e.stopPropagation();
			setSelectValue && setSelectValue(value._id);
		};

		return (
			<>
				<li className='z-50 list-none'>
					<ItemComponent value={value} {...rest} isSelected={isSelected} handleSelectProduct={handleSelectProduct} />
				</li>
			</>
		);
	});

	const onSortEndFn = ({ oldIndex, newIndex }) => {
		if (useMoveMutable) {
			arrayMoveMutable(items, oldIndex, newIndex);
			onSortEnd();
		} else {
			onSortEnd(arrayMoveImmutable(items, oldIndex, newIndex));
		}
	};

	return (
		<SortableContainerWrapper onSortEnd={onSortEndFn} {...sortableProps}>
			{items?.map((value, index) => (
				<SortableItem
					key={`item-${uniqueKey ? value[uniqueKey] : value}`}
					index={index}
					value={value}
					setSelectValue={() =>
						onSelectProductClick(value._id)
					}
					isSelected={selectedProducts.includes(value._id)}
				/>
			))}
		</SortableContainerWrapper>
	);
}
