import ActionCable from 'actioncable';
import get from 'lodash/get';
import { websocketActions } from 'actions';

const url = __CABLE_URL__;
const cable = ActionCable.createConsumer(url);
const openSubscriptions = {};

function socketHandler(dispatch, channel) {
  return {
    connected: () => {
      dispatch(websocketActions.connected(channel));
    },
    received: (packet) => {
      dispatch(websocketActions.messageReceived(channel, packet));
      if (packet.type === "entity") {
        const type = 'API_RESPONSE/WEBSOCKET_MODEL_UPDATE';
        dispatch({
          type,
          error: null,
          payload: packet.payload,
          meta: 'websocket-model-update'
        });
      }
    }
  };
}

export default function actionCableMiddleware({ dispatch, getState }) {
  return (next) => (action) => {

    const handledActions = [
      "WEBSOCKET_CONNECT",
      "WEBSOCKET_DISCONNECT",
      "WEBSOCKET_TRIGGER_ACTION"
    ];

    if (!handledActions.includes(action.type)) return next(action);

    const token = get(getState(), 'authentication.authToken');
    const { channel, options } = action.payload;

    if (action.type === "WEBSOCKET_CONNECT") {
      const conf = Object.assign({}, { channel }, { token }, options);
      openSubscriptions[channel] =
        cable.subscriptions.create(conf, socketHandler(dispatch, channel));
    }

    if (action.type === "WEBSOCKET_DISCONNECT") {
      const subscription = openSubscriptions[channel];
      if (subscription) cable.subscriptions.remove(subscription);
    }

    if (action.type === "WEBSOCKET_TRIGGER_ACTION") {
      const subscription = openSubscriptions[channel];
      if (subscription) subscription.perform(action.payload.action);
    }

    return next(action);


  };
}
