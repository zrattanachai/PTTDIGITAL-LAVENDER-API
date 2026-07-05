#!/bin/bash
trans_id=$1

#Status
echo "ResetTransaction Processing..." > '/usr/share/LavenderAPI/Setting/script/Status.txt'

#SetZeroTransaction
echo "TRUNCATE TABLE lavender.transactions RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
echo "ALTER SEQUENCE lavender.transactions_transaction_id_seq RESTART WITH ${trans_id};" | su - postgres -c "psql LAVENDERDB"
echo "TRUNCATE TABLE lavender.transactions_bk RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

#Status
echo "ResetTransaction Successful." > '/usr/share/LavenderAPI/Setting/script/Status.txt'

