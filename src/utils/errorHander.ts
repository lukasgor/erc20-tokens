import { notification } from 'antd';

const errorHander = async (fn: () => unknown) => {
  try {
    await fn();
  } catch (e: any) {
    notification.error({ message: 'Error', description: e.message });
  }
};

export default errorHander;
