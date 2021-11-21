import { Form, Input, InputNumber, message, Modal } from 'antd';
import { useMoralis } from 'react-moralis';
import { Token } from './TokensList';
import tokenBalance from '../../../utils/tokenBalance';
import errorHandler from '../../../utils/errorHander';
import web3 from '../../../utils/web3';

interface Props {
  token: Token;
  onDismiss: () => void;
}

const TokenSendModal = ({ token, onDismiss }: Props) => {
  const totalBalance = tokenBalance(token.balance, token.decimals);
  const [form] = Form.useForm();
  const { Moralis, user } = useMoralis();

  const onSubmit = async (values: any) => {
    errorHandler(async () => {
      const options = {
        type: 'erc20',
        amount: Moralis.Units.Token(values.amount, Number(token.decimals)),
        receiver: values.to,
        contractAddress: token.token_address,
        awaitReceipt: false,
      };
      const tx = await Moralis.transfer(options);
      tx.on('transactionHash', async (hash: string) => {
        const PendingTransfer = new Moralis.Object.extend('PendingTransfer');
        const pendingTransfer = new PendingTransfer();

        const transaction = await web3.eth.getTransaction(hash);
        pendingTransfer.set('to_address', values.to.toLowerCase());
        pendingTransfer.set(
          'from_address',
          user.get('ethAddress').toLowerCase()
        );
        pendingTransfer.set('transaction_hash', hash);
        pendingTransfer.set('gas_price', String(transaction.gasPrice));
        pendingTransfer.set('token_address', token.token_address.toLowerCase());
        pendingTransfer.set('token_symbol', token.symbol);
        pendingTransfer.set('amount', String(values.amount));
        pendingTransfer.set('token_decimals', String(token.decimals));
        pendingTransfer.set('nonce', String(transaction.nonce));

        await pendingTransfer.save();
        onDismiss();
        message.info('Transaction submitted successfully!');
      });
    });
  };
  return (
    <Modal
      title={`Send ${token.symbol} (${token.name})`}
      visible
      onOk={() => form.submit()}
      okText="Send"
      onCancel={onDismiss}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="To"
          name="to"
          rules={[{ required: true, message: 'Address is required!' }]}
        >
          <Input placeholder="0xBbE5DC1F4526D1eF2eD8D14c72632becB4520b09" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Amount is required!' }]}
        >
          <InputNumber placeholder="1000" style={{ width: '100%' }} />
        </Form.Item>
        <h3>Available: {totalBalance}</h3>
      </Form>
    </Modal>
  );
};

export default TokenSendModal;
