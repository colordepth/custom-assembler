import sys
import os
import unittest

PACKAGE_PARENT = '..'
SCRIPT_DIR = os.path.dirname(os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__))))
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from components.shared import *
from functions.arithmetic import *


class TestArithmetic(unittest.TestCase):

    def setUp(self):
        for r in register_value:
            register_value[r] = 65535

    def division(self, dividend, divisor):
        register_value['010'] = dividend
        register_value['011'] = divisor
        register_value['000'] = None
        register_value['001'] = None
        div(("010","011"))

        # Division result
        self.assertEqual(register_value['000'], dividend // divisor)
        self.assertEqual(register_value['001'], dividend % divisor)

        # Flags reset
        self.assertEqual(register_value['111'], 0)

    def multiplication(self, multiplicand1, multiplicand2):

        register_value['010'] = multiplicand1
        register_value['011'] = multiplicand2
        register_value["100"] = None

        mul(("100", "010","011"))

        # Division result
        self.assertEqual(register_value['100'], (multiplicand1*multiplicand2)%65536)

        # Flags check
        if multiplicand1*multiplicand2 > 2**16-1:
            self.assertEqual(register_value['111'], 1<<3)

    def addition(self, summand1, summand2):

        register_value['010'] = summand1
        register_value['011'] = summand2
        register_value["100"] = None

        add(("100", "010","011"))

        # Division result
        self.assertEqual(register_value['100'], (summand1 + summand2)%65536)

        # Flags check
        if summand1 + summand2 > 2**16-1:
            self.assertEqual(register_value['111'], 1<<3)

    def subtraction(self, minuend, subtrahend):

        register_value['010'] = minuend
        register_value['011'] = subtrahend
        register_value["100"] = None

        sub(("100", "010","011"))

        # Division result
        self.assertEqual(register_value['100'], max(minuend - subtrahend, 0))

        # Flags check
        if minuend-subtrahend < 0:
            self.assertEqual(register_value['111'], 1<<3)

    def testDiv1(self):
        dividend = 65535
        divisor = 1

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv2(self):
        dividend = 65535
        divisor = 65535

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv3(self):
        dividend = 0
        divisor = 1

        self.division(dividend, divisor)

    def testDiv4(self):
        dividend = 0
        divisor = 65535

        self.division(dividend, divisor)

    def testDiv5(self):
        dividend = 0
        divisor = 12345

        self.division(dividend, divisor)

    def testDiv6(self):
        dividend = 1
        divisor = 1

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv7(self):
        dividend = 7
        divisor = 65535

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv8(self):
        dividend = 7
        divisor = 9

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv9(self):
        dividend = 7
        divisor = 7**3

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv10(self):
        dividend = 12345
        divisor = 54321

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv11(self):
        dividend = 54327
        divisor = 54321

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testDiv12(self):
        dividend = 54327
        divisor = 13787

        self.division(dividend, divisor)
        dividend,divisor = divisor,dividend
        self.division(dividend, divisor)

    def testMul1(self):
        multiplicand1 = 65535
        multiplicand2 = 1

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul2(self):
        multiplicand1 = 65535
        multiplicand2 = 65535

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul3(self):
        multiplicand1 = 0
        multiplicand2 = 1

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul4(self):
        multiplicand1 = 0
        multiplicand2 = 65535

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul5(self):
        multiplicand1 = 0
        multiplicand2 = 12345

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul6(self):
        multiplicand1 = 1
        multiplicand2 = 1

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul7(self):
        multiplicand1 = 7
        multiplicand2 = 65535

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul8(self):
        multiplicand1 = 7
        multiplicand2 = 9

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul9(self):
        multiplicand1 = 7
        multiplicand2 = 7**3

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul10(self):
        multiplicand1 = 12345
        multiplicand2 = 54321

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul11(self):
        multiplicand1 = 54327
        multiplicand2 = 54321

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testMul12(self):
        multiplicand1 = 54327
        multiplicand2 = 13787

        self.multiplication(multiplicand1, multiplicand2)
        self.multiplication(multiplicand2, multiplicand1)

    def testAdd1(self):
        summand1 = 65535
        summand2 = 65535

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testAdd2(self):
        summand1 = 0
        summand2 = 0

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testAdd3(self):
        summand1 = 0
        summand2 = 65535

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testAdd4(self):
        summand1 = 1
        summand2 = 1

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testAdd5(self):
        summand1 = 30321
        summand2 = 31123

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)
    
    def testAdd6(self):
        summand1 = 40321
        summand2 = 31123

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testAdd7(self):
        summand1 = 20987
        summand2 = 10987

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testAdd8(self):
        summand1 = 40321
        summand2 = 51123

        self.addition(summand1, summand2)
        self.addition(summand2, summand1)

    def testSub1(self):
        minuend = 65535
        subtrahend = 65535

        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub2(self):
        minuend = 0
        subtrahend = 0
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub3(self):
        minuend = 0
        subtrahend = 65535
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub4(self):
        minuend = 1
        subtrahend = 1
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub5(self):
        minuend = 30321
        subtrahend = 31123
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub6(self):
        minuend = 40321
        subtrahend = 31123
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub7(self):
        minuend = 20988
        subtrahend = 10987
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

    def testSub8(self):
        minuend = 40321
        subtrahend = 51123
        
        self.subtraction(minuend, subtrahend)
        minuend,subtrahend = subtrahend, minuend
        self.subtraction(minuend, subtrahend)

if __name__ == '__main__':
    unittest.main()