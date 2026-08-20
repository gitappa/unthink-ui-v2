import React from "react";
import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMoveImmutable, arrayMoveMutable } from "array-move";
import styles from "./SortableContainer.module.css";

const getItemId = (value, uniqueKey) => String(uniqueKey ? value[uniqueKey] : value);

const SortableItem = ({
	id,
	value,
	ItemComponent,
	disabled,
	selectedProducts,
	onSelectProductClick,
	...rest
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, disabled });

	const handleSelectProduct = (e) => {
		e.stopPropagation();
		onSelectProductClick && onSelectProductClick(value._id);
	};

	return (
		<li
			ref={setNodeRef}
			className={styles.sortableListItem}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.7 : undefined,
			}}
			{...attributes}
			{...listeners}
		>
			<ItemComponent
				value={value}
				{...rest}
				isSelected={selectedProducts.includes(value._id)}
				handleSelectProduct={handleSelectProduct}
			/>
		</li>
	);
};

export default function SortableContainer({
	enableSelectProduct,
	onSelectProductClick,
	selectedProducts = [],
	items,
	onSortEnd,
	ItemComponent,
	sortableProps = {},
	useMoveMutable = false,
	uniqueKey, // unique key in the items list
	...rest // extra common props to send in item component
}) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		})
	);
	const itemIds = items?.map((value) => getItemId(value, uniqueKey)) || [];
	const disabled = sortableProps.disabled || enableSelectProduct;

	const onSortEndFn = ({ active, over }) => {
		if (!over || active.id === over.id) return;

		const oldIndex = itemIds.indexOf(active.id);
		const newIndex = itemIds.indexOf(over.id);
		if (oldIndex < 0 || newIndex < 0) return;

		if (useMoveMutable) {
			arrayMoveMutable(items, oldIndex, newIndex);
			onSortEnd();
		} else {
			onSortEnd(arrayMoveImmutable(items, oldIndex, newIndex));
		}
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onSortEndFn}>
			<SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
				<ul className={sortableProps.className}>
					{items?.map((value) => {
						const id = getItemId(value, uniqueKey);

						return (
							<SortableItem
								key={`item-${id}`}
								id={id}
								value={value}
								ItemComponent={ItemComponent}
								disabled={disabled}
								enableSelectProduct={enableSelectProduct}
								onSelectProductClick={onSelectProductClick}
								selectedProducts={selectedProducts}
								{...rest}
							/>
						);
					})}
				</ul>
			</SortableContext>
		</DndContext>
	);
}
