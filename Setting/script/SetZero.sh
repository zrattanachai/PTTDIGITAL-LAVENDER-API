#!/bin/bash
back_date=$(date +'%Y%m%d')
trans_id=$1
pass=$2

#Status
echo "SetZero Processing..." > '/usr/share/LavenderAPI/Setting/script/Status.txt'

#Stop PM2
echo "muj,nv,ufvdw,h" | su - -c "pm2 stop Command GetGrade GetPos GetPrice GetRealtimeValue GetStack GetTanks GetTotalizer GetTransaction Initialize Login_Logout LavenderSetting ManageAPI Support"


#BackupLAVENDERDB
if PGPASSWORD="${pass}" pg_dump -U postgres -h localhost -Ft LAVENDERDB > "/usr/share/LavenderAPI/Setting/script/bakDB_Zero_${back_date}.sql"; then

	#SetZeroTransaction
	echo "TRUNCATE TABLE lavender.transactions RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	echo "ALTER SEQUENCE lavender.transactions_transaction_id_seq RESTART WITH ${trans_id};" | su - postgres -c "psql LAVENDERDB"
	echo "TRUNCATE TABLE lavender.transactions_bk RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroPump
	echo "TRUNCATE TABLE lavender.pumps RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroDisplay
	echo "TRUNCATE TABLE lavender.pumps_display RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroAdvance
	echo "TRUNCATE TABLE lavender.advances_setting RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroRealtime
	echo "TRUNCATE TABLE lavender.pumps_real_time RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	
	#SetZeroHose
	echo "TRUNCATE TABLE lavender.hoses RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	
	#SetZeroPumpLog
	echo "TRUNCATE TABLE lavender.pump_logs RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	
	#SetZeroPumpCommand
	echo "TRUNCATE TABLE lavender.pump_commands RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	echo "TRUNCATE TABLE lavender.commands_bk RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroTank
	echo "TRUNCATE TABLE lavender.tanks RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroTankDelivery
	echo "TRUNCATE TABLE lavender.tanks_delivery RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	
	#SetZeroTankAlarmHistory
	echo "TRUNCATE TABLE lavender.tanks_alarm_history RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
	
	#SetZeroTankLog
	echo "TRUNCATE TABLE lavender.tank_gauge_logs RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"

	#SetZeroLoop
        echo "TRUNCATE TABLE lavender.loops RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
			
	#SetZeroGrade
	echo "TRUNCATE TABLE lavender.grades RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
					
	#SetZeroPriceProfile
	echo "TRUNCATE TABLE lavender.price_profiles RESTART IDENTITY;" | su - postgres -c "psql LAVENDERDB"
fi

#Stop PM2
echo "muj,nv,ufvdw,h" | su - -c "pm2 start Command GetGrade GetPos GetPrice GetRealtimeValue GetStack GetTanks GetTotalizer GetTransaction Initialize Login_Logout LavenderSetting ManageAPI Support --watch"

#Status
echo "SetZero Successful." > '/usr/share/LavenderAPI/Setting/script/Status.txt'
