## from Coffee to Python

PAWA (Porting Algorithms With Annotations)

```
'True'  => 'True'
'False' => 'False'
'null'  => 'None'
'++'    => '+=1'

/@(\w)/                                   => 'self.$1'
/\s([^\s]+): ->/                          => ' def $1\(self\):'
/\s([^\s]+):\s*\(([^)]*)\)\s*->/          => ' def $1\(self,$2\):'
/.substring\(/                            => '['    # closing bracket will need to be added manually
/^(\s*(?:#\s)?(?:if|while|for)\W.*[^:])$/ => '$1:'
/^(\s*(?:#\s)?)unless(\W.*[^:])$/         => '$1if not$2:'
/^(\s*(?:#\s)?)else if(\W.*[^:]):?$/      => '$1elif$2:'
/^(\s*(?:#\s)?else)$/                     => '$1:'
/\[([^]]*)\.\.([^]]*)\]/                  => 'range\($1,$2\)'
/([\w.]*)\.length/                        => 'len\($1\)'
/\.shift\(/                               => '.pop\(0'
/\.push\(/                                => '.append\('
/([\w.]*)\.join\(([^)]+)\)/               => '$2.join\($1\)'
/#\{([\w.]+)\}/                           => "'+$1+'"
```