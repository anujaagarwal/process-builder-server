# Schema Design

1. Processes Table
   This table stores the high-level information about each process.
   id: Primary Key, unique identifier for each process.
   name: Text, name of the process.
   description: Text, a brief description of the process.
   created_at: DateTime, timestamp when the process was created.
   updated_at: DateTime, timestamp when the process was last updated.
   user_id: Foreign Key, identifier linking to the user who created/owns the process (assuming a user table exists).

2. Steps Table
   This table stores individual steps for each process.

id: Primary Key, unique identifier for each step.
process_id: Foreign Key, links to the Processes table.
title: Text, title of the step.
description: Text, detailed description of the step.
order: Integer, the order of the step within the process.
metadata: JSON/Text, for storing any additional information related to the step.
created_at: DateTime, timestamp when the step was created.
updated_at: DateTime, timestamp when the step was last updated.
