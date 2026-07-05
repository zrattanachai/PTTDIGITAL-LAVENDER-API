#!/bin/bash
back_date=$(date +'%Y%m%d')
trans_id=$1
pass=$2

#Status
echo "SetZeroTransaction Processing..." > '/usr/share/LavenderAPI/Setting/script/Status.txt'

#Stop PM2
echo "muj,nv,ufvdw,h" | su - -c "pm2 stop Command GetGrade GetPos GetPrice GetRealtimeValue GetStack GetTanks GetTotalizer GetTransaction Initialize Login_Logout LavenderSetting ManageAPI Support"

#BackupLAVENDERDB
if PGPASSWORD="${pass}" pg_dump -U postgres -h localhost -Ft LAVENDERDB > "/usr/share/LavenderAPI/Setting/script/bakDB_trans_${back_date}.sql"; then

	#SetZeroTransaction
	echo "TRUNCATE TABLE lavender.transactions RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	echo "ALTER SEQUENCE lavender.transactions_transaction_id_seq RESTART WITH ${trans_id};" | su - postgres -c "psql LAVENDERDB"
	echo "TRUNCATE TABLE lavender.transactions_bk RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	
	#SetTank
	echo "UPDATE lavender.tanks SET theoretical_volume = 0, dip_volume = 0, dip_level = 0" | su - postgres -c "psql LAVENDERDB"
fi

#Stop PM2
echo "muj,nv,ufvdw,h" | su - -c "pm2 start Command GetGrade GetPos GetPrice GetRealtimeValue GetStack GetTanks GetTotalizer GetTransaction Initialize Login_Logout LavenderSetting ManageAPI Support --watch"

#Status
echo "SetZeroTransaction Successful." > '/usr/share/LavenderAPI/Setting/script/Status.txt'
