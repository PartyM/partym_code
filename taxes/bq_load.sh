#!/bin/bash

bq load --source_format=CSV --autodetect us_tax_data.selected_income gs://us-tax-data/20*.csv 
