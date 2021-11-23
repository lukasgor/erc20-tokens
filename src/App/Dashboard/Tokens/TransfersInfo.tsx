import { Card, message, Skeleton } from 'antd';
import React from 'react';
import { useMoralis } from 'react-moralis';
import TransactionItem from './TransactionItem';
import web3 from '../../../utils/web3';

export type Transaction = {
  amount: string;
  createdAt: string;
  from_address: string;
  gas_price: string;
  to_address: string;
  token_address: string;
  token_decimals: string;
  token_symbol: string;
  transaction_hash: string;
  updatedAt: string;
  id: string;
  nonce: string;
};

let pendingTransactionSubscription: any;
let transferUpdateSubscription: any;
let newTransferSubscription: any;

const TransfersInfo = () => {
  const { Moralis, user } = useMoralis();
  const [recentTransactions, setRecentTransactions] = React.useState<
    null | Transaction[]
  >(null);
  const [averageMiningTime, setAverageMiningTime] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    const fetch = async () => {
      if (!user) {
        return;
      }
      const transfersQuery = new Moralis.Query('PendingTransfer');
      transfersQuery.equalTo('from_address', user.get('ethAddress'));
      transfersQuery.descending('createdAt');
      transfersQuery.limit(5);
      const transfers = await transfersQuery.find();
      setRecentTransactions(
        transfers.map((t: any) => ({ ...t.attributes, id: t.id }))
      );
    };
    fetch();
  }, [user, Moralis]);

  React.useEffect(() => {
    let nowBlock: any;
    // Get the current block number
    web3.eth.getBlockNumber(function (err, nowBlockNumber) {
      // Get the current block
      web3.eth.getBlock(nowBlockNumber, function (err, nb) {
        nowBlock = nb;
        // Get the block 500 blocks ago
        web3.eth.getBlock(nowBlockNumber - 500, function (err, thenBlock: any) {
          // Take the average of the then and now timestamps
          const averageBlockTime =
            (nowBlock.timestamp - thenBlock.timestamp) / 500.0;
          setAverageMiningTime(averageBlockTime);
        });
      });
    });
  }, []);

  React.useEffect(() => {
    const subsribeToNewTransactions = async () => {
      if (newTransferSubscription) {
        return;
      }
      const transfersQuery = new Moralis.Query('PendingTransfer');
      newTransferSubscription = await transfersQuery.subscribe();
      newTransferSubscription.on('create', (newTransaction: any) => {
        setRecentTransactions((currentRecentTransactions) => {
          if (!currentRecentTransactions) {
            return [newTransaction.attributes];
          }
          if (currentRecentTransactions.length >= 5) {
            currentRecentTransactions.splice(-1, 1);
          }
          const newRecentTransactions = [
            {
              ...newTransaction.attributes,
              id: newTransaction.id,
            },
            ...currentRecentTransactions,
          ];

          return newRecentTransactions;
        });
      });
    };

    subsribeToNewTransactions();

    return () => {
      if (newTransferSubscription) {
        newTransferSubscription.unsubscribe();
        newTransferSubscription = null;
      }
    };
  }, [Moralis]);

  React.useEffect(() => {
    const subscribeToPendingTransactionUpdates = () => {
      if (pendingTransactionSubscription) {
        return;
      }

      pendingTransactionSubscription = web3.eth
        .subscribe('pendingTransactions')
        .on('data', async (transaction) => {
          const res = await web3.eth.getTransaction(transaction);

          if (!res) {
            return;
          }

          if (res.from.toLowerCase() === user.get('ethAddress')) {
            const maybeUpdatedTransaction = recentTransactions?.find(
              (tx) => tx.nonce === String(res.nonce)
            );
            if (maybeUpdatedTransaction) {
              const Transfer = new Moralis.Object.extend('PendingTransfer');
              const query = new Moralis.Query(Transfer);
              const transfer = await query.get(maybeUpdatedTransaction.id);
              transfer.set('transaction_hash', res.hash);
              transfer.set('gas_price', res.gasPrice);
              await transfer.save();
            }
          }
        });
    };

    subscribeToPendingTransactionUpdates();

    return () => {
      if (pendingTransactionSubscription) {
        pendingTransactionSubscription.unsubscribe();
        pendingTransactionSubscription = null;
      }
    };
  }, [user, recentTransactions, Moralis]);

  React.useEffect(() => {
    const subscribeToTransferUpdates = async () => {
      if (transferUpdateSubscription) {
        return;
      }
      const Transfer = new Moralis.Object.extend('PendingTransfer');
      const query = new Moralis.Query(Transfer);
      transferUpdateSubscription = await query.subscribe();
      transferUpdateSubscription.on('update', (updatedTransaction: any) => {
        setRecentTransactions((transactions) => {
          if (!transactions) {
            return null;
          }
          const indexToUpdate = transactions.findIndex(
            (tx) => tx.id === updatedTransaction.id
          );
          const updatedTx = [...transactions];
          if (indexToUpdate > -1) {
            updatedTx[indexToUpdate] = {
              ...updatedTx[indexToUpdate],
              id: updatedTransaction.id,
              ...updatedTransaction.attributes,
            };
          }
          return updatedTx;
        });
        message.info('Transaction has been updated!');
      });
    };

    subscribeToTransferUpdates();

    return () => {
      if (transferUpdateSubscription) {
        transferUpdateSubscription.unsubscribe();
        transferUpdateSubscription = null;
      }
    };
  }, [Moralis, setRecentTransactions]);

  return (
    <Card
      title={
        <h3 style={{ margin: 0, padding: 0 }}>
          Recently sent transactions{' '}
          {recentTransactions && `(${recentTransactions.length})`}
        </h3>
      }
    >
      {recentTransactions &&
        recentTransactions.map((t) => (
          <TransactionItem
            key={t.transaction_hash}
            transaction={t}
            averageMiningTime={averageMiningTime}
          />
        ))}
      {!recentTransactions && <Skeleton />}
      {recentTransactions?.length === 0 &&
        'No transactions recorded on the platform.'}
    </Card>
  );
};

export default TransfersInfo;
