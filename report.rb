#!/usr/bin/env ruby
# encoding: utf-8

def calc(file)
  data = File.foreach(file).map(&:to_i)
  total = data.inject{|a, i| a + i}
  average = total / data.length.to_f
  variance = data.inject{|a, i| a + (i - average.to_i) ** 2} / data.length
  [average, variance]
end

ans, vns = calc 'node_js_result_small.txt'
anl, vnl = calc 'node_js_result_large.txt'
aes, ves = calc 'electron_result_small.txt'
ael, vel = calc 'electron_result_large.txt'

puts <<-EOS
AVERAGE
-------

Node.js
  Small: #{ans}
  Large: #{anl}
Electron
  Small: #{aes}
  Large: #{ael}


VARIANCE
--------

Node.js
  Small: #{vns}
  Large: #{vnl}
Electron
  Small: #{ves}
  Large: #{vel}
EOS
