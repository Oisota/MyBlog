---
title: Linux Backup Script
date: 2017-01-27
---

Here is the script I use to backup my home directory.
Its a simple bash script that uses `tar` and `gzip` to archive and compress the files.
I run it every few weeks and backup my data to another hard drive in my computer.

```bash
#!/usr/bin/env bash

backup_path=$1
date_stamp=$(date +%F)

dir=$backup_path$date_stamp"_backup"
file=$date_stamp"_backup.tar.gz"
log=$date_stamp"_backup.log"

mkdir $dir
cd $dir

tar --create \
    --file=$file ~/ \
    --preserve-permissions \
    --absolute-names \
    --verbose \
    --gzip \
    --exclude=/home/derek/Documents/Books \
    --exclude=/home/derek/Downloads \
    --exclude=/home/derek/Desktop \
    --exclude=/home/derek/Videos \
    --exclude=/home/derek/Music \
    --exclude=/home/derek/Games \
    --exclude=/home/derek/Steam \
    --exclude=$file \
    --exclude=/home/derek/.* > $log
```

The script takes a single command line argument, which is the path to where the backup will be created.
At the specified path, the script creates a directory with two files inside.
One file is the actual gzipped archive file and the other is a log file containing the output of the `tar` command.
Lets go through the script to understand how it works.

```bash
#!/usr/bin/env bash

backup_path=$1
date_stamp=$(date +%F)
```

The first line is the 'shebang' line that tells shell where the the bash interpreter for our system is.
Then we save the path where we want the backup to be stored to the variable `backup_path`.
The special `$1` variable in bash gives the value of the first command line arg.
We then create a date stamp of the form `YYYY-MM-DD` using the `date` command line utility.
Details of the `date` command can be found by typeing `man date` into the terminal.

Next we create some more variables using the date stamp we saved above.

```bash
dir=$backup_path$date_stamp"_backup"
file=$date_stamp"_backup.tar.gz"
log=$date_stamp"_backup.log"
```

We save the name of the directory where the backup will be saved,
the name of the gzipped tar file that will contain the backup,
and the name of the log file.

We then create the directory with `mkdir` and then `cd` into it.

```bash
mkdir $dir
cd $dir
```

Lastly we have the actual `tar` command that does the actuall archiving and compressing.
The flags hopefully are straightforward to follow and understand.

```bash
tar --create \
    --file=$file ~/ \
    --preserve-permissions \
    --absolute-names \
    --verbose \
    --gzip \
    --exclude=/home/derek/Documents/Books \
    --exclude=/home/derek/Downloads \
    --exclude=/home/derek/Desktop \
    --exclude=/home/derek/Videos \
    --exclude=/home/derek/Music \
    --exclude=/home/derek/Games \
    --exclude=/home/derek/Steam \
    --exclude=$file \
    --exclude=/home/derek/.* > $log
```

The command creates a new archive using the file name specified by `$file`.
It preserves file permissions and uses absolute names.
It gives verbose output and compresses using gzip compression.
The exclude flag ignores directories and does not archive them.
You can add whichever directories you don't want to get backed up here.
The verbose output of the command is then redirected to the log file.

This script can then be run like so:

```no-highlight
$ ./backup.sh /path/to/storage/
```

This will create the following directory structure:

```no-highlight
/path/to/storage/2017-01-20_backup/
├── 2017-01-20_backup.log
└── 2017-01-20_backup.tar.gz
```

The log file will contain the verbose output of the `tar` command which will be a list of everyfile that has been archived.
This is useful in checking whether or not the command ran as expected or if there was an error.
The other file is the compressed archive containing all the files that were backed up.

Retrieving files from the backup can be done using the command `tar -xvzf <backup-file>`.

What I generally do when I run this script is I open two terminal windows and in one I run the script and in another I run `tail -f <logfile>`.
This way I can watch the log file in real time in order to see what the script is doing and make sure its backing up the files I want it to.
