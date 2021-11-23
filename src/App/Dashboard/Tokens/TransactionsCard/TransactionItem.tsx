import { Alert, Skeleton, Spin, Tooltip } from 'antd';
import React from 'react';
import { LinkOutlined, SendOutlined } from '@ant-design/icons';
import { Transaction } from './TransactionsCard';
import web3 from '../../../../utils/web3';

type Props = {
  transaction: Transaction;
  averageMiningTime: number | null;
};

enum Status {
  'Success' = 'Success',
  'Error' = 'Error',
  'Pending' = 'Pending',
  'Cancelled' = 'Cancelled',
}

const displayAvgTime = (
  status: Status,
  averageMiningTime: Props['averageMiningTime']
) => {
  if (status !== Status.Pending || !averageMiningTime) {
    return '';
  }
  return `, Average processing time: ~${averageMiningTime} seconds`;
};

const getStatusFromType = (status: Status) => {
  switch (status) {
    case Status.Error:
      return 'error';
    case Status.Pending:
      return 'info';
    case Status.Success:
      return 'success';
    case Status.Cancelled:
      return 'warning';
    default:
      return 'info';
  }
};

const TransactionItem = ({ transaction, averageMiningTime }: Props) => {
  const [status, setStatus] = React.useState<Status | null>(null);

  React.useEffect(() => {
    const id = setInterval(async () => {
      // check the status only if transaction is not done
      if (
        status === Status.Success ||
        status === Status.Error ||
        status === Status.Cancelled
      ) {
        clearInterval(id);
        return;
      }
      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transaction_hash
      );

      if (!receipt) {
        setStatus(Status.Pending);
        return;
      }

      if (receipt.status === false) {
        setStatus(Status.Error);
        return;
      }

      if (receipt.status === true) {
        const tx = await web3.eth.getTransaction(transaction.transaction_hash);
        // check if transaction has been reverted
        if (tx.input === '0x') {
          setStatus(Status.Cancelled);
        } else {
          setStatus(Status.Success);
        }
      }
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [transaction.transaction_hash, status]);

  if (!status) {
    return (
      <Skeleton.Input style={{ width: 500, marginBottom: '10px' }} active />
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
      description={`Gas price: ${Number(
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
