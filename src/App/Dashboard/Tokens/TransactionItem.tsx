import { Alert, Skeleton, Spin, Tooltip } from 'antd';
import React from 'react';
import { Transaction } from './TransfersInfo';
import web3 from '../../../utils/web3';
import { LinkOutlined, SendOutlined } from '@ant-design/icons';

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

const getStatusFromType = (status: Status) => {
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

  React.useEffect(() => {
    const fetchT = async () => {
      const res = await fetch(
        `https://api-ropsten.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${transaction.transaction_hash}&apikey=I51FA8TNIMUQN8I5R7DRNUQRWH19QRP98S`
      );
      const json = await res.json();
      console.log(json);
    };
    fetchT();
  }, [transaction.transaction_hash]);

  if (!status) {
    return (
      <Skeleton.Input style={{ width: 600, marginBottom: '10px' }} active />
    );
  }

  return (
    <Alert
      message={
        <strong style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            -{transaction.amount} {transaction.token_symbol}{' '}
            <SendOutlined style={{ margin: '0 10px' }} />{' '}
            {transaction.to_address}
          </div>
          <Tooltip title="View on Etherscan">
            <a
              href={`https://ropsten.etherscan.io/tx/${transaction.transaction_hash}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit' }}
            >
              <LinkOutlined />
            </a>
          </Tooltip>
        </strong>
      }
      description={`Fee: ${Number(
        web3.utils.fromWei(transaction.gas_price, 'gwei')
      ).toFixed(2)} gwei, Status: ${status}${displayAvgTime(
        status,
        averageMiningTime
      )}`}
      type={getStatusFromType(status)}
      style={{ marginBottom: '10px' }}
      icon={status === Status.Pending ? <Spin /> : undefined}
      showIcon
    />
  );
};

export default TransactionItem;
