import orderDetails from "./order-from-feed.module.css";
import {
  FormattedDate,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getOrder } from "../../services/actions/actions";
import Loader from "../loader/loader";
import TotalPrice from "../total-price/total-price";

function OrderFromFeed() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { burgerIngredients } = useSelector(
    (state) => state.rootReducer.burgerIngredients
  );
  const { order, ordersFailed, ordersRequest } = useSelector(
    (state) => state.rootReducer.getOrders
  );
  const orderNumber = Number(id);
  useEffect(() => {
    dispatch(getOrder(orderNumber));
  }, [dispatch, orderNumber]);
  const unique = order.ingredients?.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });

  function findIngredient(ingredient) {
    return burgerIngredients?.find((item) => item._id === ingredient);
  }

  const burgerIngredientsImg = order.ingredients?.map((item) =>
    findIngredient(item)
  );

  const totalPrice = useMemo(() => {
    return burgerIngredientsImg?.reduce((acc, item) => {
      return (
        acc +
        (item?.type !== "bun" ? item?.price : 0) +
        (item?.type === "bun" ? 2 * item?.price : 0)
      );
    }, 0);
  }, [burgerIngredientsImg]);

  const counter = (ingredient) => {
    const ingredientsId = order.ingredients.filter(
      (item) => item === ingredient
    );
    return ingredientsId.length;
  };

  const statusColor = () => {
    if (order.status === "done") {
      return `text text_type_main-small pb-5 mb-5 ${orderDetails.color_green}`
    } else if (order.status === "created") {
      return `text text_type_main-small pb-5 mb-5 ${orderDetails.color_purple}`
    }
    else if (order.status === "pending") {
      return `text text_type_main-small pb-5 mb-5${orderDetails.color_white}`
    }
  }

  const dateFromServer = order.updatedAt;
  if (ordersFailed) {
    return <p>Произошла ошибка при получении данных</p>;
  } else if (ordersRequest) {
    return <Loader />;
  } else {
    return (
      <>
        {orderNumber === order.number && (
          <div className={`${orderDetails.list_container} mt-15`}>
            <ul className={`${orderDetails.list_order} pb-5`}>
              <li
                className={`${orderDetails.order_number} text text_type_digits-default pb-5`}
              >
                #{order.number}
              </li>
              <li
                className={`${orderDetails.order} text text_type_main-medium pt-5 pb-3`}
              >
                {order.name}
              </li>
              <li className={statusColor()}>
              {`${order.status === "done"}` ? "Выполнен" : `${order.status}`}
              </li>
              <li className="text text_type_main-medium pt-5">
                Состав:
                <ul className={`${orderDetails.list_ingredients} pt-3`}>
                  {order
                    ? unique.map((ingredient, index) => (
                      <li className={`${orderDetails.item}`} key={index}>
                        <div className={`${orderDetails.item_img}`}>
                          <img
                            src={findIngredient(ingredient)?.image_mobile}
                            alt=""
                            className={`${orderDetails.image}`}
                          />
                        </div>

                        <p
                          className={`${orderDetails.name} text text_type_main-small`}
                        >
                          {findIngredient(ingredient)?.name}
                        </p>
                        <div className={`${orderDetails.price}`}>
                          <p
                            className={`${orderDetails.price_number} text text_type_digits-default`}
                          >
                            {counter(ingredient)} x
                            {findIngredient(ingredient)?.price}
                          </p>
                          <CurrencyIcon type="primary" />
                        </div>
                      </li>
                    ))
                    : null}
                </ul>
              </li>
            </ul>
            <div className={`${orderDetails.list_time_price} pt-5`}>
              <FormattedDate
                date={new Date(dateFromServer)}
                className="text text_type_main-default text_color_inactive"
              />
              <div className={`${orderDetails.price}`}>
                <TotalPrice totalPrice={totalPrice ? totalPrice : 0} />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default OrderFromFeed;
