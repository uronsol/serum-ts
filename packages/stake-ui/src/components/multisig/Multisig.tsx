import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import { encode as encodeBase64 } from 'js-base64';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RemoveIcon from '@material-ui/icons/Remove';
import Collapse from '@material-ui/core/Collapse';
import Toolbar from '@material-ui/core/Toolbar';
import CreateIcon from '@material-ui/icons/Create';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import BuildIcon from '@material-ui/icons/Build';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import BN from 'bn.js';
import {
  Account,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import { useWallet } from '../common/WalletProvider';
import { ViewTransactionOnExplorerButton } from '../common/Notification';
import * as loader from '../../utils/loader';

export default function Multisig() {
  const history = useHistory();
  const [multisigAddress, setMultisigAddress] = useState('');
  const disabled = !isValidPubkey(multisigAddress);
  const searchFn = () => {
    history.push(`/multisig/${multisigAddress}`);
  };
  return (
    <Container fixed maxWidth="md">
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '24px',
        }}
      >
        <NewMultisigButton />
      </div>
      <Card style={{ marginTop: '24px' }}>
        <CardContent>
          <div style={{ display: 'flex' }}>
            <TextField
              fullWidth
              label="Multisig address"
              value={multisigAddress}
              onChange={e => setMultisigAddress(e.target.value as string)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  searchFn();
                }
              }}
            />
            <IconButton disabled={disabled} onClick={searchFn}>
              <SearchIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

function isValidPubkey(addr: string): boolean {
  try {
    new PublicKey(addr);
    return true;
  } catch (_) {
    return false;
  }
}

export function MultisigInstance({ multisig }: { multisig: PublicKey }) {
  const { multisigClient } = useWallet();
  const [multisigAccount, setMultisigAccount] = useState<any>(undefined);
  const [transactions, setTransactions] = useState<any>([]);
  const [showSignerDialog, setShowSignerDialog] = useState(false);
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(
    false,
  );
  useEffect(() => {
    multisigClient.account
      .multisig(multisig)
      .then((account: any) => {
        setMultisigAccount(account);
      })
      .catch((err: any) => {
        console.error(err);
        setMultisigAccount(null);
      });
  }, [multisig, multisigClient.account]);
  useEffect(() => {
    multisigClient.account.transaction.all(multisig.toBuffer()).then(txs => {
      setTransactions(txs);
    });
  }, [multisigClient.account.transaction, multisig]);
  return (
    <Container fixed maxWidth="md" style={{ marginBottom: '16px' }}>
      <div>
        <Card style={{ marginTop: '24px' }}>
          {multisigAccount === undefined ? (
            <CardContent style={{ paddingBottom: '0px' }}>
              <CircularProgress
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </CardContent>
          ) : multisigAccount === null ? (
            <CardContent>
              <Typography
                color="textSecondary"
                style={{
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                Multisig not found
              </Typography>
            </CardContent>
          ) : (
            <></>
          )}
        </Card>
        {multisigAccount && (
          <Paper>
            <AppBar
              style={{ marginTop: '24px' }}
              position="static"
              color="default"
              elevation={1}
            >
              <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }} component="h2">
                  {multisig.toString()} | {multisigAccount.threshold.toString()}{' '}
                  of {multisigAccount.owners.length.toString()} Multisig
                </Typography>
                <Tooltip title="Signer" arrow>
                  <IconButton onClick={() => setShowSignerDialog(true)}>
                    <CreateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add" arrow>
                  <IconButton onClick={() => setShowAddTransactionDialog(true)}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
            <List disablePadding>
              {transactions.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No transactions found" />
                </ListItem>
              ) : (
                transactions.map((tx: any) => (
                  <TxListItem multisigAccount={multisigAccount} tx={tx} />
                ))
              )}
            </List>
          </Paper>
        )}
      </div>
      <AddTransactionDialog
        multisig={multisig}
        open={showAddTransactionDialog}
        onClose={() => setShowAddTransactionDialog(false)}
      />
      <SignerDialog
        multisig={multisig}
        open={showSignerDialog}
        onClose={() => setShowSignerDialog(false)}
      />
    </Container>
  );
}

function NewMultisigButton() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
      >
        New
      </Button>
      <NewMultisigDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function NewMultisigDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { multisigClient } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [threshold, setThreshold] = useState(2);
  // @ts-ignore
  const zeroAddr = new PublicKey().toString();
  const [participants, setParticipants] = useState([
    multisigClient.provider.wallet.publicKey.toString(),
    zeroAddr,
  ]);
  const _onClose = () => {
    onClose();
    setThreshold(2);
    setParticipants([zeroAddr, zeroAddr]);
  };
  const createMultisig = async () => {
    enqueueSnackbar('Creating multisig', {
      variant: 'info',
    });
    const multisig = new Account();
    // Disc. + threshold + nonce.
    const baseSize = 8 + 8 + 1;
    const ownerSize = participants.length * 32 + 8;
    const multisigSize = baseSize + ownerSize;
    const [, nonce] = await PublicKey.findProgramAddress(
      [multisig.publicKey.toBuffer()],
      multisigClient.programId,
    );
    const owners = participants.map(p => new PublicKey(p));
    console.log('owners', owners, nonce);
    const tx = await multisigClient.rpc.createMultisig(
      owners,
      new BN(threshold),
      nonce,
      {
        accounts: {
          multisig: multisig.publicKey,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [multisig],
        instructions: [
          await multisigClient.account.multisig.createInstruction(
            multisig,
            // @ts-ignore
            multisigSize,
          ),
        ],
      },
    );
    enqueueSnackbar(`Multisig created: ${multisig.publicKey.toString()}`, {
      variant: 'success',
      action: <ViewTransactionOnExplorerButton signature={tx} />,
    });
    _onClose();
  };
  return (
    <Dialog fullWidth open={open} onClose={_onClose} maxWidth="md">
      <DialogTitle>
        <Typography variant="h4" component="h2">
          New Multisig
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Threshold"
          value={threshold}
          type="number"
          onChange={e => setThreshold(parseInt(e.target.value) as number)}
        />
        {participants.map((p, idx) => (
          <TextField
            key={p}
            fullWidth
            label="Participant"
            value={p}
            onChange={e => {
              const p = [...participants];
              p[idx] = e.target.value;
              setParticipants(p);
            }}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => {
              const p = [...participants];
              // @ts-ignore
              p.push(new PublicKey().toString());
              setParticipants(p);
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={_onClose}>Cancel</Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          onClick={() =>
            createMultisig().catch(err => {
              const str = err ? err.toString() : '';
              enqueueSnackbar(`Error creating multisig: ${str}`, {
                variant: 'error',
              });
            })
          }
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TxListItem({
  multisigAccount,
  tx,
}: {
  multisigAccount: any;
  tx: any;
}) {
  const [open, setOpen] = useState(false);
  const rows = [
    {
      field: 'Program ID',
      value: tx.account.programId.toString(),
    },
    {
      field: 'Did execute',
      value: tx.account.didExecute.toString(),
    },
    {
      field: 'Instruction data',
      value: <code>{encodeBase64(tx.account.data)}</code>,
    },
    {
      field: 'Multisig',
      value: tx.account.multisig.toString(),
    },
    {
      field: 'Transaction signature',
      value: tx.publicKey.toString(),
    },
  ];
  const msAccountRows = multisigAccount.owners.map(
    (owner: PublicKey, idx: number) => {
      return {
        field: owner.toString(),
        value: tx.account.signers[idx] ? <CheckIcon /> : <RemoveIcon />,
      };
    },
  );
  const approve = async () => {
    console.log('approving hte transaction');
  };
  const execute = async () => {
    console.log('executing');
  };
  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          {tx.account.programId.equals(BPF_LOADER_UPGRADEABLE_PID) ? (
            <BuildIcon />
          ) : (
            <ReceiptIcon />
          )}
        </ListItemIcon>
        {ixLabel(tx)}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div style={{ background: '#ececec', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{ marginRight: '10px' }}
              variant="contained"
              color="primary"
              onClick={approve}
            >
              Approve
            </Button>
            <Button variant="contained" color="secondary" onClick={execute}>
              Execute
            </Button>
          </div>
          <Card style={{ marginTop: '16px' }}>
            <CardContent>
              <Table>
                <TableBody>
                  {rows.map(r => (
                    <TableRow>
                      <TableCell>{r.field}</TableCell>
                      <TableCell align="right">{r.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card style={{ marginTop: '16px' }}>
            <CardContent>
              <Table>
                <TableBody>
                  {msAccountRows.map((r: any) => (
                    <TableRow>
                      <TableCell>{r.field}</TableCell>
                      <TableCell align="right">{r.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card style={{ marginTop: '16px' }}>
            <CardContent>
              <AccountsList accounts={tx.account.accounts} />
            </CardContent>
          </Card>
        </div>
      </Collapse>
    </>
  );
}

function ixLabel(tx: any) {
  if (tx.account.programId.equals(BPF_LOADER_UPGRADEABLE_PID)) {
		// Upgrade instruction.
    if (tx.account.data.equals(Buffer.from([3]))) {
      return (
        <ListItemText
          primary="Program upgrade"
          secondary={tx.publicKey.toString()}
        />
      );
    }
  }
  return <ListItemText primary={tx.publicKey.toString()} />;
}

function AccountsList({ accounts }: { accounts: any }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Public Key</TableCell>
          <TableCell align="right">Writable</TableCell>
          <TableCell align="right">Signer</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {accounts.map((r: any) => (
          <TableRow>
            <TableCell>{r.pubkey.toString()}</TableCell>
            <TableCell align="right">{r.isWritable.toString()}</TableCell>
            <TableCell align="right">{r.isSigner.toString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SignerDialog({
  multisig,
  open,
  onClose,
}: {
  multisig: PublicKey;
  open: boolean;
  onClose: () => void;
}) {
  const { multisigClient } = useWallet();
  const [signer, setSigner] = useState<null | string>(null);
  useEffect(() => {
    PublicKey.findProgramAddress(
      [multisig.toBuffer()],
      multisigClient.programId,
    ).then(addrNonce => setSigner(addrNonce[0].toString()));
  }, [multisig, multisigClient.programId, setSigner]);
  return (
    <Dialog open={open} fullWidth onClose={onClose} maxWidth="md">
      <DialogTitle>
        <Typography variant="h4" component="h2">
          Program Derived Address
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingBottom: '16px' }}>
        <DialogContentText>
          <b>{signer}</b>. This is the address one should use as the authority
          for data governed by the multisig.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function AddTransactionDialog({
  multisig,
  open,
  onClose,
}: {
  multisig: PublicKey;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} fullWidth onClose={onClose} maxWidth="md">
      <DialogTitle>
        <Typography variant="h4" component="h2">
          New Transaction
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingBottom: '16px' }}>
        <DialogContentText>
          Create a new transaction to be signed by the multisig. This
          transaction will not execute until enough owners have signed the
          transaction.
        </DialogContentText>
        <List disablePadding>
          <TransactionListItem multisig={multisig} onClose={onClose} />
        </List>
      </DialogContent>
    </Dialog>
  );
}

function TransactionListItem({
  multisig,
  onClose,
}: {
  multisig: PublicKey;
  onClose: Function;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItem button onClick={() => setOpen(open => !open)}>
        <ListItemIcon>
          <BuildIcon />
        </ListItemIcon>
        <ListItemText primary={'Program upgrade'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <TransactionListItemDetails multisig={multisig} onClose={onClose} />
      </Collapse>
    </>
  );
}

const BPF_LOADER_UPGRADEABLE_PID = new PublicKey(
  'BPFLoaderUpgradeab1e11111111111111111111111',
);

function TransactionListItemDetails({
  multisig,
  onClose,
}: {
  multisig: PublicKey;
  onClose: Function;
}) {
  const [programId, setProgramId] = useState<null | string>(null);
  const [buffer, setBuffer] = useState<null | string>(null);

  const { multisigClient } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const createTransactionAccount = async () => {
    enqueueSnackbar('Creating transaction', {
      variant: 'info',
    });
    const programAddr = new PublicKey(programId as string);
    const bufferAddr = new PublicKey(buffer as string);
    const data = loader.encodeInstruction({ upgrade: {} });

    const programAccount = await (async () => {
      const programAccount = await multisigClient.provider.connection.getAccountInfo(
        programAddr,
      );
      if (programAccount === null) {
        enqueueSnackbar('Invalid program ID', {
          variant: 'error',
        });
        return;
      }
      return loader.decodeState(programAccount.data).program;
    })();
    const spill = multisigClient.provider.wallet.publicKey;
    const [multisigSigner] = await PublicKey.findProgramAddress(
      [multisig.toBuffer()],
      multisigClient.programId,
    );
    const accs = [
      {
        pubkey: programAccount.programdataAddress,
        isWritable: true,
        isSigner: false,
      },
      { pubkey: programAddr, isWritable: true, isSigner: false },
      { pubkey: bufferAddr, isWritable: true, isSigner: false },
      { pubkey: spill, isWritable: true, isSigner: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isWritable: false, isSigner: false },
      { pubkey: multisigSigner, isWritable: false, isSigner: false },
    ];
    const txSize = 1000; // TODO: tighter bound.
    const transaction = new Account();
    const tx = await multisigClient.rpc.createTransaction(
      BPF_LOADER_UPGRADEABLE_PID,
      accs,
      data,
      {
        accounts: {
          multisig,
          transaction: transaction.publicKey,
          proposer: multisigClient.provider.wallet.publicKey,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [transaction],
        instructions: [
          await multisigClient.account.transaction.createInstruction(
            transaction,
            // @ts-ignore
            txSize,
          ),
        ],
      },
    );
    enqueueSnackbar('Transaction created', {
      variant: 'success',
      action: <ViewTransactionOnExplorerButton signature={tx} />,
    });
    onClose();
  };

  return (
    <div
      style={{
        background: '#f1f0f0',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <TextField
        fullWidth
        style={{ marginTop: '16px' }}
        label="Program ID"
        value={programId}
        onChange={e => setProgramId(e.target.value as string)}
      />
      <TextField
        style={{ marginTop: '16px' }}
        fullWidth
        label="New program buffer"
        value={buffer}
        onChange={e => setBuffer(e.target.value as string)}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '16px',
          paddingBottom: '16px',
        }}
      >
        <Button onClick={() => createTransactionAccount()}>
          Create upgrade
        </Button>
      </div>
    </div>
  );
}
