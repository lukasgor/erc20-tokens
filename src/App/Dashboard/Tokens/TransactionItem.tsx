import { Alert, Skeleton, Spin } from 'antd';
import React from 'react';
import { Transaction } from './TransfersInfo';
import web3 from '../../../utils/web3';

type Props = {
  transaction: Transaction;
  averageMiningTime: number | null;
};

enum Status {
  'Success' = 'Success',
  'Error' = 'Error',
  'Pending' = 'Pending',
}

const displayAvgTime = (
  status: Status,
  averageMiningTime: Props['averageMiningTime']
) => {
  if (status !== Status.Pending || !averageMiningTime) {
    return '';
  }
  return `, Average time: ~${averageMiningTime} seconds`;
};

const mapStatusToType = (status: Status) => {
  switch (status) {
    case Status.Error:
      return 'error';
    case Status.Pending:
      return 'info';
    case Status.Success:
      return 'success';

    default:
      return 'info';
  }
};

const TransactionItem = ({ transaction, averageMiningTime }: Props) => {
  const [status, setStatus] = React.useState<Status | null>(null);
  React.useEffect(() => {
    const id = setInterval(() => {
      // check the status only if it's pending
      if (status === Status.Success || status === Status.Error) {
        clearInterval(id);
        return;
      }
      web3.eth.getTransactionReceipt(
        transaction.transaction_hash,
        (err, receipt) => {
          if (!receipt) {
            setStatus(Status.Pending);
            return;
          }
          if (receipt.status === false) {
            setStatus(Status.Error);
          } else if (receipt.status === true) {
            setStatus(Status.Success);
          }
        }
      );
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [transaction.transaction_hash, status]);

  if (!status) {
    return (
      <Skeleton.Input style={{ width: 600, marginBottom: '10px' }} active />
    );
  }

  return (
    <Alert
      message={`${transaction.amount} ${transaction.token_symbol} -> ${transaction.to_address}`}
      description={`Fee: ${Number(
        web3.utils.fromWei(transaction.gas_price, 'gwei')
      ).toFixed(2)} gwei, Status: ${status}${displayAvgTime(
        status,
        averageMiningTime
      )}`}
      type={mapStatusToType(status)}
      style={{ marginBottom: '10px' }}
      icon={status === Status.Pending ? <Spin /> : undefined}
      showIcon
    />
  );
};

export default TransactionItem;
